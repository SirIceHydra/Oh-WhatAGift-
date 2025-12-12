import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle, useMemo } from 'react';
import { Canvas, Image, IText } from 'fabric';

type CustomiserProps = {
  backgroundImageUrl?: string;
  matchElementSelector?: string; // optional selector to match width (e.g. '#product-main-image')
  threadColours?: {
    name: string;
    options: string[];
  };
};

export type CustomiserHandle = {
  exportComposite: () => Promise<{
    dataUrl: string;
    blob: Blob;
    mode: 'composite' | 'overlay';
    width: number;
    height: number;
    backgroundFit?: { left: number; top: number; scaledWidth: number; scaledHeight: number };
    uploadedImageDataUrl?: string;
    textEntries?: string[];
    textColors?: string[]; // Hex codes for each text entry
  } | null>;
};

const Customiser = forwardRef<CustomiserHandle, CustomiserProps>(function Customiser(
  { backgroundImageUrl, matchElementSelector, threadColours }: CustomiserProps,
  ref
): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricCanvasRef = useRef<Canvas | null>(null);
  const [textValue, setTextValue] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lastUploadDataUrlRef = useRef<string | undefined>(undefined);
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [matchedWidth, setMatchedWidth] = useState<number>(0);
  
  // Extract available hex codes from threadColours
  const availableColors = useMemo(() => {
    if (!threadColours?.options || threadColours.options.length === 0) {
      return ['#222222']; // Default dark gray if no colors available
    }
    
    const hexCodes = threadColours.options
      .map((opt: string) => String(opt).trim())
      .filter((opt: string) => {
        const hexPattern6 = /^#?[0-9A-Fa-f]{6}$/;
        const hexPattern3 = /^#?[0-9A-Fa-f]{3}$/;
        return hexPattern6.test(opt) || hexPattern3.test(opt);
      })
      .map((hex: string) => {
        // Normalize 3-digit hex to 6-digit
        let normalized = hex.trim().startsWith('#') ? hex.trim() : `#${hex.trim()}`;
        if (normalized.length === 4) {
          // Expand #RGB to #RRGGBB
          normalized = `#${normalized[1]}${normalized[1]}${normalized[2]}${normalized[2]}${normalized[3]}${normalized[3]}`;
        }
        return normalized;
      });
    
    return hexCodes.length > 0 ? hexCodes : ['#222222'];
  }, [threadColours]);
  
  // State for selected text color (defaults to first available color)
  const [selectedTextColor, setSelectedTextColor] = useState<string>('#222222');
  
  // Update selected color when available colors change
  useEffect(() => {
    if (availableColors.length > 0) {
      // If current selection is not in available colors, reset to first available
      if (!availableColors.includes(selectedTextColor)) {
        setSelectedTextColor(availableColors[0]);
      }
    } else {
      // If no colors available, use default
      setSelectedTextColor('#222222');
    }
  }, [availableColors, selectedTextColor]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new Canvas(canvasRef.current, {
      backgroundColor: '#ffffff',
      selection: true,
      enableRetinaScaling: false,
    });
    fabricCanvasRef.current = canvas;

    // Ensure valid baseline to avoid CanvasTextBaseline enum errors in some environments
    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      try {
        ctx.textBaseline = 'alphabetic';
      } catch {
        // ignore - some browsers may not allow setting here, but Fabric will set it during render
      }
    }

    // Initial sizing to container width
    const sizeOnce = () => {
      if (!containerRef.current) {
        // If container not ready, set a default size
        canvas.setWidth(400);
        canvas.setHeight(400);
        requestAnimationFrame(() => canvas.requestRenderAll());
        return;
      }
      const rawWidth = containerRef.current.clientWidth || containerRef.current.getBoundingClientRect().width;
      const width = Math.max(400, Math.floor(rawWidth || 400)); // Minimum 400px
      const height = width; // Square canvas
      canvas.setWidth(width);
      canvas.setHeight(height);
      requestAnimationFrame(() => canvas.requestRenderAll());
    };
    sizeOnce();

    return () => {
      canvas.dispose();
      fabricCanvasRef.current = null;
    };
  }, []);

  // Resize observer - keep canvas square and in sync with target element (or our own container)
  useEffect(() => {
    const c = fabricCanvasRef.current;
    const pickTarget = (): HTMLElement | null => {
      if (matchElementSelector) {
        const el = document.querySelector(matchElementSelector) as HTMLElement | null;
        if (el) return el;
      }
      return containerRef.current;
    };

    const target = pickTarget();
    if (!target) return;

    const applySize = (width: number) => {
      const canvas = fabricCanvasRef.current;
      if (!canvas) return;
      const w = Math.max(2, Math.floor(width));
      setMatchedWidth(w);
      canvas.setWidth(w);
      canvas.setHeight(w); // Square canvas
      fitBackgroundToCanvas();
      requestAnimationFrame(() => canvas.requestRenderAll());
      
      // If background image exists, ensure it's properly fitted after resize
      if (canvas.backgroundImage) {
        fitBackgroundToCanvas();
        requestAnimationFrame(() => canvas.requestRenderAll());
      }
    };

    // initial - match width of target, keep square
    const initialWidth = target.clientWidth || target.getBoundingClientRect().width;
    if (initialWidth) applySize(initialWidth);

    const ro = new ResizeObserver(() => {
      const width = target.clientWidth || target.getBoundingClientRect().width;
      if (width) applySize(width);
    });
    ro.observe(target);

    return () => ro.disconnect();
  }, [matchElementSelector]);

  const fitBackgroundToCanvas = (): void => {
    const c = fabricCanvasRef.current;
    if (!c) return;
    const bg = c.backgroundImage as Image | undefined;
    if (!bg) return;
    const cw = c.getWidth();
    const ch = c.getHeight();
    const iw = bg.width ?? cw;
    const ih = bg.height ?? ch;
    
    // Use object-cover behavior: scale to fill, crop excess, center
    const scaleX = cw / iw;
    const scaleY = ch / ih;
    const scale = Math.max(scaleX, scaleY);
    
    // Center the scaled image (may have negative offsets for cropping)
    const scaledWidth = iw * scale;
    const scaledHeight = ih * scale;
    const left = (cw - scaledWidth) / 2;
    const top = (ch - scaledHeight) / 2;
    
    bg.set({
      scaleX: scale,
      scaleY: scale,
      originX: 'left',
      originY: 'top',
      left,
      top,
    });
  };

  const getBackgroundFit = (): { left: number; top: number; scaledWidth: number; scaledHeight: number } | undefined => {
    const c = fabricCanvasRef.current;
    if (!c) return undefined;
    const bg = c.backgroundImage as Image | undefined;
    if (!bg) return undefined;
    const cw = c.getWidth();
    const ch = c.getHeight();
    const iw = bg.width ?? cw;
    const ih = bg.height ?? ch;
    // Match object-cover behavior
    const scaleX = cw / iw;
    const scaleY = ch / ih;
    const scale = Math.max(scaleX, scaleY);
    const scaledWidth = iw * scale;
    const scaledHeight = ih * scale;
    const left = (cw - scaledWidth) / 2;
    const top = (ch - scaledHeight) / 2;
    return { left, top, scaledWidth: iw * scale, scaledHeight: ih * scale };
  };

  // Set/Update background image from URL
  useEffect(() => {
    if (!backgroundImageUrl) {
      console.warn('Customiser: No background image URL provided');
      return;
    }

    let retryCount = 0;
    const maxRetries = 50; // Maximum 5 seconds of retries (50 * 100ms)
    let isCancelled = false;

    // Helper to get base64 image via our proxy endpoint (avoids CORS tainting)
    const fetchBase64Image = async (url: string): Promise<string | null> => {
      const wpUrl = typeof process !== 'undefined' 
        ? (process.env.NEXT_PUBLIC_WORDPRESS_URL || process.env.REACT_APP_WORDPRESS_URL || '')
        : '';
      const apiKey = typeof process !== 'undefined'
        ? (process.env.NEXT_PUBLIC_WP_API_KEY || process.env.REACT_APP_WP_API_KEY || 'ohwhatagift-react-2024')
        : 'ohwhatagift-react-2024';
      const namespace = typeof process !== 'undefined'
        ? (process.env.NEXT_PUBLIC_WP_API_NAMESPACE || process.env.REACT_APP_WP_API_NAMESPACE || 'ohwhatagift/v1')
        : 'ohwhatagift/v1';
      
      if (!wpUrl) {
        console.warn('Customiser: WordPress URL not configured, cannot use base64 proxy');
        return null;
      }

      try {
        const endpoint = `${wpUrl}/wp-json/${namespace}/images/base64?url=${encodeURIComponent(url)}`;
        console.log('Customiser: Fetching image via base64 proxy...');
        const response = await fetch(endpoint, {
          headers: {
            'X-API-Key': apiKey,
          },
        });
        
        if (!response.ok) {
          console.warn('Customiser: Base64 proxy request failed:', response.status);
          return null;
        }
        
        const data = await response.json();
        if (data.success && data.data_url) {
          console.log('Customiser: Successfully fetched base64 image');
          return data.data_url;
        }
        return null;
      } catch (err) {
        console.warn('Customiser: Failed to fetch image via base64 proxy:', err);
        return null;
      }
    };

    // Wait for canvas to be initialized and have valid dimensions
    const loadImage = async () => {
      if (isCancelled) return;
      
      const c = fabricCanvasRef.current;
      if (!c) {
        retryCount++;
        if (retryCount < maxRetries) {
          setTimeout(loadImage, 100);
        } else {
          console.error('Customiser: Canvas not initialized after maximum retries');
        }
        return;
      }

      const canvasWidth = c.getWidth();
      const canvasHeight = c.getHeight();
      if (canvasWidth <= 0 || canvasHeight <= 0) {
        retryCount++;
        if (retryCount < maxRetries) {
          setTimeout(loadImage, 100);
        } else {
          console.error('Customiser: Canvas dimensions invalid after maximum retries. Width:', canvasWidth, 'Height:', canvasHeight);
        }
        return;
      }

      // Reset retry count for image loading
      retryCount = 0;

      // Ensure URL is absolute
      let imageUrl = backgroundImageUrl;
      if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('data:') && typeof window !== 'undefined') {
        // Convert relative URL to absolute
        if (imageUrl.startsWith('/')) {
          imageUrl = window.location.origin + imageUrl;
        } else {
          imageUrl = window.location.origin + '/' + imageUrl;
        }
      }

      console.log('Customiser: Loading background image:', imageUrl, 'Canvas size:', canvasWidth, 'x', canvasHeight);

      const applyBackground = (img: Image | null) => {
        if (isCancelled) return;
        if (!img) {
          console.warn('Customiser: Failed to load background image');
          return;
        }
        console.log('Customiser: Image loaded, dimensions:', img.width, 'x', img.height);
        // In fabric.js v6, setBackgroundImage is synchronous
        c.backgroundImage = img;
        fitBackgroundToCanvas();
        requestAnimationFrame(() => c.requestRenderAll());
        console.log('Customiser: Background image applied successfully');
      };

      // Check if this is a cross-origin image (needs proxy)
      const isCrossOrigin = typeof window !== 'undefined' && 
        imageUrl.startsWith('http') && 
        !imageUrl.startsWith(window.location.origin);

      // Strategy: For cross-origin images, prefer base64 proxy to avoid CORS tainting
      if (isCrossOrigin) {
        console.log('Customiser: Cross-origin image detected, trying base64 proxy first...');
        const base64Url = await fetchBase64Image(imageUrl);
        if (base64Url && !isCancelled) {
          try {
            const img = await Image.fromURL(base64Url);
            if (img && img.width && img.height) {
              console.log('Customiser: Image loaded from base64 proxy, dimensions:', img.width, 'x', img.height);
              applyBackground(img);
              return; // Success!
            }
          } catch (proxyErr) {
            console.warn('Customiser: Failed to load base64 image:', proxyErr);
          }
        }
      }

      // Direct load with CORS (works for same-origin or if base64 proxy not available)
      try {
        console.log('Customiser: Attempting to load image with CORS...');
        const img = await Image.fromURL(imageUrl, { crossOrigin: 'anonymous' });
        if (img && img.width && img.height) {
          console.log('Customiser: Image loaded with CORS, dimensions:', img.width, 'x', img.height);
          applyBackground(img);
        } else {
          throw new Error('Image loaded but has no dimensions');
        }
      } catch (error) {
        console.warn('Customiser: Image load failed with CORS, retrying without...', error);
        try {
          const fallbackImg = await Image.fromURL(imageUrl);
          if (fallbackImg && fallbackImg.width && fallbackImg.height) {
            console.log('Customiser: Image loaded without CORS, dimensions:', fallbackImg.width, 'x', fallbackImg.height);
            applyBackground(fallbackImg);
          } else {
            console.error('Customiser: Failed to load image even without CORS. URL:', imageUrl);
          }
        } catch (fallbackError) {
          console.error('Customiser: Failed to load image even without CORS. URL:', imageUrl, fallbackError);
        }
      }
    };

    // Start loading after a small delay to ensure canvas is ready
    const timeout = setTimeout(loadImage, 200);
    return () => {
      isCancelled = true;
      clearTimeout(timeout);
    };
  }, [backgroundImageUrl]);

  useImperativeHandle(ref, () => ({
    exportComposite: async () => {
      const c = fabricCanvasRef.current;
      if (!c) return null;
      // ensure latest fit and render
      fitBackgroundToCanvas();
      c.discardActiveObject();
      c.requestRenderAll();
      // gather text entries and their colors from canvas
      const textObjects = c
        .getObjects()
        .filter((o: any) => o && (o.type === 'i-text' || o.type === 'text'));
      
      const textEntries: string[] = textObjects
        .map((o: any) => String(o.text || ''))
        .filter((s) => s.length > 0);
      
      const textColors: string[] = textObjects
        .map((o: any) => {
          const fill = o.fill;
          if (typeof fill === 'string') {
            // Normalize hex color (handle rgb() and hex formats)
            if (fill.startsWith('#')) {
              return fill.toUpperCase();
            } else if (fill.startsWith('rgb')) {
              // Convert rgb/rgba to hex (simplified - assumes standard format)
              const match = fill.match(/\d+/g);
              if (match && match.length >= 3) {
                const r = parseInt(match[0], 10).toString(16).padStart(2, '0');
                const g = parseInt(match[1], 10).toString(16).padStart(2, '0');
                const b = parseInt(match[2], 10).toString(16).padStart(2, '0');
                return `#${r}${g}${b}`.toUpperCase();
              }
            }
            return fill.toUpperCase();
          }
          return '#000000'; // Default black if color cannot be determined
        })
        .filter((s) => s.length > 0);
      
      const backgroundFit = getBackgroundFit();
      
      // Get uploaded image data URL from ref
      const uploadedImageDataUrl = lastUploadDataUrlRef.current;
      console.log('Export composite - uploaded image data URL:', uploadedImageDataUrl ? `${uploadedImageDataUrl.substring(0, 50)}... (${uploadedImageDataUrl.length} chars)` : 'not set');
      
      try {
        // Try to export full composite (may fail due to CORS with cross-origin images)
        const dataUrl = c.toDataURL({ format: 'png', multiplier: 2 });
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        return { dataUrl, blob, mode: 'composite' as const, width: c.getWidth(), height: c.getHeight(), backgroundFit, uploadedImageDataUrl, textEntries, textColors };
      } catch (err) {
        console.warn('Composite export failed (CORS), falling back to overlay-only export');
        // Fallback: export overlay only (remove background temporarily)
        const originalBg = c.backgroundImage;
        const originalBgColor = c.backgroundColor;
        
        // Fabric.js v6: direct property assignment
        c.backgroundImage = undefined;
        c.backgroundColor = 'transparent';
        c.requestRenderAll();
        
        try {
          const dataUrl = c.toDataURL({ format: 'png', multiplier: 2 });
          const res = await fetch(dataUrl);
          const blob = await res.blob();
          
          // Restore background
          if (originalBg) c.backgroundImage = originalBg;
          if (originalBgColor) c.backgroundColor = originalBgColor;
          c.requestRenderAll();
          
          return { dataUrl, blob, mode: 'overlay' as const, width: c.getWidth(), height: c.getHeight(), backgroundFit, uploadedImageDataUrl: lastUploadDataUrlRef.current, textEntries, textColors };
        } catch (overlayErr) {
          // Restore background even on error
          if (originalBg) c.backgroundImage = originalBg;
          if (originalBgColor) c.backgroundColor = originalBgColor;
          c.requestRenderAll();
          
          console.error('Overlay export also failed:', overlayErr);
          return null;
        }
      }
    },
  }));

  const handleAddText = (): void => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    // Defensive: set baseline before drawing text to prevent 'alphabetical' errors
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      try {
        ctx.textBaseline = 'alphabetic';
      } catch {
        // ignore
      }
    }

    const content = (textValue ?? '').trim() || 'Text';
    const text = new IText(content, {
      left: canvas.getWidth() / 2,
      top: canvas.getHeight() / 2,
      originX: 'center',
      originY: 'center',
      fill: selectedTextColor,
      fontFamily: 'Arial',
      fontSize: 28,
      editable: true,
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.requestRenderAll();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0] ?? null;
    if (!file) {
      setImageFile(null);
      setSelectedFileName('');
      return;
    }
    setSelectedFileName(file.name);
    setImageFile(file);

    // Auto-add image on selection
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const reader = new FileReader();
    reader.onerror = () => {
      // eslint-disable-next-line no-console
      console.error('Failed to read image file.');
    };
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      lastUploadDataUrlRef.current = dataUrl;
      console.log('Image uploaded - stored data URL:', dataUrl.substring(0, 50) + '... (length: ' + dataUrl.length + ')');
      try {
        const img = await Image.fromURL(dataUrl, { crossOrigin: 'anonymous' });
        if (!img) return;
        const canvasWidth = canvas.getWidth();
        const canvasHeight = canvas.getHeight();
        const maxWidth = canvasWidth * 0.8;
        const maxHeight = canvasHeight * 0.8;
        const imgWidth = img.width ?? 1;
        const imgHeight = img.height ?? 1;
        const scale = Math.min(maxWidth / imgWidth, maxHeight / imgHeight, 1);

        img.set({
          left: canvasWidth / 2,
          top: canvasHeight / 2,
          originX: 'center',
          originY: 'center',
        });
        img.scale(scale);

        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.requestRenderAll();
      } catch (error) {
        console.error('Failed to add image to canvas:', error);
      }
    };
    reader.readAsDataURL(file);

    // Allow re-selecting the same file by clearing input value
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    // Prevent duplicate insertion via Add Image button after auto-add
    setImageFile(null);
  };

  const handleAddImage = (): void => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !imageFile) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      lastUploadDataUrlRef.current = dataUrl;
      try {
        const img = await Image.fromURL(dataUrl);
        if (!img) return;
        const canvasWidth = canvas.getWidth();
        const canvasHeight = canvas.getHeight();
        const maxWidth = canvasWidth * 0.8;
        const maxHeight = canvasHeight * 0.8;
        const imgWidth = img.width ?? 1;
        const imgHeight = img.height ?? 1;
        const scale = Math.min(maxWidth / imgWidth, maxHeight / imgHeight, 1);

        img.set({
          left: canvasWidth / 2,
          top: canvasHeight / 2,
          originX: 'center',
          originY: 'center',
        });
        img.scale(scale);

        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.requestRenderAll();
      } catch (error) {
        console.error('Failed to add image to canvas:', error);
      }
    };
    reader.readAsDataURL(imageFile);
  };

  const handleClearCanvas = (): void => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    canvas.discardActiveObject();
    // remove all drawable objects but keep background and canvas settings
    canvas.getObjects().forEach((obj) => canvas.remove(obj));
    canvas.requestRenderAll();
    // reset file input state
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    // reset uploaded image data URL
    lastUploadDataUrlRef.current = undefined;
  };


  return (
    <div className="flex flex-col md:flex-row gap-6 items-start">
      {/* Canvas Container - Left Side */}
      <div
        ref={containerRef}
        className="w-full md:w-1/2 lg:w-3/5 border-2 border-brand-green/30 bg-white overflow-hidden rounded-2xl shadow-sm"
        style={matchedWidth ? { width: matchedWidth, height: matchedWidth } : { aspectRatio: '1/1' }}
      >
        <canvas ref={canvasRef} className="block w-full h-full" />
      </div>
      
      {/* Controls - Right Side */}
      <div className="w-full md:w-1/2 lg:w-2/5 flex flex-col gap-4 p-4 sm:p-6 bg-white rounded-2xl border-2 border-brand-green/20 shadow-sm">
        {/* Thread Colours Section */}
        {threadColours && threadColours.options && threadColours.options.length > 0 && (() => {
          // Extract hex codes from options (supports both #RRGGBB and RRGGBB formats, 3 or 6 digits)
          const hexCodes = threadColours.options
            .map((opt: string) => String(opt).trim())
            .filter((opt: string) => {
              const hexPattern6 = /^#?[0-9A-Fa-f]{6}$/;
              const hexPattern3 = /^#?[0-9A-Fa-f]{3}$/;
              return hexPattern6.test(opt) || hexPattern3.test(opt);
            })
            .map((hex: string) => {
              // Normalize 3-digit hex to 6-digit
              let normalized = hex.trim().startsWith('#') ? hex.trim() : `#${hex.trim()}`;
              if (normalized.length === 4) {
                // Expand #RGB to #RRGGBB
                normalized = `#${normalized[1]}${normalized[1]}${normalized[2]}${normalized[2]}${normalized[3]}${normalized[3]}`;
              }
              return normalized;
            });
          
          if (hexCodes.length === 0) return null;
          
          return (
            <div className="mb-2 pb-4 border-b border-brand-green/20">
              <h5 className="text-sm sm:text-base font-heading text-brand-gold mb-2">
                Available Thread Colours
              </h5>
              
              {/* Disclaimer */}
              <div className="mb-3 p-2 bg-brand-cream/30 border-l-2 border-brand-gold/50 rounded">
                <p className="text-brand-grey-green text-xs leading-relaxed">
                  <strong className="text-brand-gold text-xs">Note:</strong> Please choose an image which suits the available thread colours shown below. 
                  If your image doesn't match these colours, we will choose the closest matching colour for you.
                </p>
              </div>
              
              {/* Color Swatches */}
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                {hexCodes.map((hex: string, index: number) => {
                  return (
                    <div 
                      key={index}
                      className="flex flex-col items-center gap-1 p-1.5 bg-brand-cream rounded border border-brand-green/20 hover:border-brand-green/50 transition-colors"
                    >
                      {/* Color Swatch */}
                      <div
                        className="w-1/2 aspect-square rounded border border-brand-green/30"
                        style={{ backgroundColor: hex }}
                        title={hex}
                      />
                      {/* Hex Code */}
                      <span className="text-[10px] font-mono text-brand-grey-green font-medium">
                        {hex.toUpperCase()}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}
        
        <h4 className="text-lg sm:text-xl font-heading text-brand-gold mb-2">
          Add Your Customisation
        </h4>
        
        {/* Text Input Section */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-brand-grey-green">
            Add Text
          </label>
          <input
            type="text"
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            placeholder="Enter text to add..."
            className="w-full px-4 py-3 border-2 border-brand-green/30 bg-brand-light-green rounded-lg text-brand-grey-green placeholder:text-brand-grey-green/50 focus:outline-none focus:border-brand-green transition-colors"
          />
          
          {/* Text Color Picker */}
          {availableColors.length > 0 && (
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-brand-grey-green">
                Text Colour
              </label>
              <div className="flex flex-wrap gap-2">
                {availableColors.map((color, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedTextColor(color)}
                    className={`relative w-8 h-8 rounded border-2 transition-all ${
                      selectedTextColor === color
                        ? 'border-brand-gold scale-110 shadow-md ring-2 ring-brand-gold/50'
                        : 'border-brand-green/30 hover:border-brand-green/60'
                    }`}
                    style={{ backgroundColor: color }}
                    title={color.toUpperCase()}
                    aria-label={`Select color ${color.toUpperCase()}`}
                  >
                    {selectedTextColor === color && (
                      <svg
                        className="absolute inset-0 m-auto w-4 h-4 text-white drop-shadow-md"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <button
            type="button"
            onClick={handleAddText}
            className="w-full px-4 py-3 bg-brand-green text-brand-cream font-semibold rounded-lg hover:bg-brand-green/90 transition-colors"
          >
            Add Text to Canvas
          </button>
        </div>
        
        {/* Divider */}
        <div className="border-t border-brand-green/20 my-2"></div>
        
        {/* Image Upload Section */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-brand-grey-green">
            Add Image
          </label>
          <input
            id="customiser-file"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="hidden"
          />
          <label
            htmlFor="customiser-file"
            className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-brand-green text-brand-cream font-semibold rounded-lg hover:bg-brand-green/90 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Upload Image to Canvas
          </label>
          {selectedFileName && (
            <p className="text-sm text-brand-grey-green/70 text-center">
              Added: {selectedFileName}
            </p>
          )}
        </div>
        
        {/* Divider */}
        <div className="border-t border-brand-green/20 my-2"></div>
        
        {/* Clear Button */}
        <button
          type="button"
          onClick={handleClearCanvas}
          className="w-full px-4 py-3 bg-red-50 text-red-600 font-semibold rounded-lg border-2 border-red-200 hover:bg-red-100 transition-colors"
        >
          Clear All Customisations
        </button>
        
        {/* Instructions */}
        <p className="text-xs text-brand-grey-green/60 mt-2">
          Tip: Click on text or images on the canvas to select, move, resize, or rotate them.
        </p>
      </div>
    </div>
  );
});

export default Customiser;

