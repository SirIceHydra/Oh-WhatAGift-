import React, { useState, useEffect } from 'react';
import { ProductVariation, ProductAttribute } from '../../types/product';

interface VariationSelectorProps {
  variations: ProductVariation[];
  attributes?: ProductAttribute[]; // Product attributes (used for variation selection)
  variationAttributes?: Record<string, string[]>; // Fallback for backward compatibility
  onVariationSelect: (variation: ProductVariation) => void;
  selectedVariation?: ProductVariation;
  disabled?: boolean;
}

export const VariationSelector: React.FC<VariationSelectorProps> = ({
  variations,
  attributes: providedAttributes,
  variationAttributes: providedVariationAttributes,
  onVariationSelect,
  selectedVariation,
  disabled = false
}) => {
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});

  // Build attribute map from product attributes (preferred) or fallback to variationAttributes
  const attributeMap = React.useMemo(() => {
    // Priority 1: Use product attributes if provided
    if (providedAttributes && providedAttributes.length > 0) {
      const map: Record<string, string[]> = {};
      providedAttributes
        .filter(attr => attr.variation === true) // Only use attributes marked for variations
        .forEach(attr => {
          const attrName = attr.name;
          // Ensure options is an array
          const options = Array.isArray(attr.options) ? attr.options : [];
          if (options.length > 0) {
            map[attrName] = options;
          }
        });
      if (Object.keys(map).length > 0) {
        return map;
      }
    }
    
    // Priority 2: Use provided variationAttributes
    if (providedVariationAttributes && Object.keys(providedVariationAttributes).length > 0) {
      return providedVariationAttributes;
    }
    
    // Priority 3: Derive from variations (fallback)
    if (!variations || variations.length === 0) {
      return {};
    }
    
    const derived: Record<string, Set<string>> = {};
    
    variations.forEach(variation => {
      if (variation.attributes) {
        Object.entries(variation.attributes).forEach(([key, value]) => {
          if (!value) return;
          
          // Normalize key - remove prefixes like 'pa_', 'attribute_', 'attribute_pa_'
          let normalizedKey = key;
          if (normalizedKey.startsWith('attribute_pa_')) {
            normalizedKey = normalizedKey.replace('attribute_pa_', '');
          } else if (normalizedKey.startsWith('attribute_')) {
            normalizedKey = normalizedKey.replace('attribute_', '');
          } else if (normalizedKey.startsWith('pa_')) {
            normalizedKey = normalizedKey.replace('pa_', '');
          }
          
          // Capitalize first letter for display
          normalizedKey = normalizedKey.charAt(0).toUpperCase() + normalizedKey.slice(1);
          
          if (!derived[normalizedKey]) {
            derived[normalizedKey] = new Set();
          }
          derived[normalizedKey].add(String(value));
        });
      }
    });
    
    // Convert Sets to arrays and sort
    return Object.fromEntries(
      Object.entries(derived).map(([key, valueSet]) => [
        key, 
        Array.from(valueSet).sort()
      ])
    );
  }, [providedAttributes, providedVariationAttributes, variations]);

  // Update selected attributes when selectedVariation changes
  useEffect(() => {
    if (selectedVariation && selectedVariation.attributes) {
      setSelectedAttributes(selectedVariation.attributes);
    }
  }, [selectedVariation]);

  // Helper to normalize attribute keys for matching
  // WooCommerce uses different formats: "Material", "pa_material", "attribute_pa_material", etc.
  const normalizeAttributeKey = (key: string): string[] => {
    const normalized = key.toLowerCase().trim();
    const original = key.trim();
    
    // Generate all possible key variations
    return [
      original, // Original case
      normalized, // Lowercase
      `pa_${normalized}`, // pa_material
      `attribute_${normalized}`, // attribute_material
      `attribute_pa_${normalized}`, // attribute_pa_material
      // Also try with spaces replaced by underscores/hyphens
      original.replace(/\s+/g, '_'),
      original.replace(/\s+/g, '-'),
      normalized.replace(/\s+/g, '_'),
      normalized.replace(/\s+/g, '-'),
    ];
  };

  // Helper to check if variation matches selected attributes
  const variationMatchesAttributes = (variation: ProductVariation, attrs: Record<string, string>): boolean => {
    return Object.keys(attrs).every(attrName => {
      const value = attrs[attrName];
      const variationAttrs = variation.attributes || {};
      const possibleKeys = normalizeAttributeKey(attrName);
      
      // Check if any of the possible keys match
      return possibleKeys.some(key => {
        const variationValue = variationAttrs[key];
        return variationValue === value || String(variationValue).toLowerCase() === String(value).toLowerCase();
      });
    });
  };

  // Handle attribute selection
  const handleAttributeChange = (attributeName: string, value: string) => {
    const newAttributes = { ...selectedAttributes, [attributeName]: value };
    setSelectedAttributes(newAttributes);

    // Try to find matching variation
    // For made-to-order products, we allow selection even if no exact variation matches
    const matchingVariation = variations.find(variation => 
      variationMatchesAttributes(variation, newAttributes)
    );

    if (matchingVariation) {
      onVariationSelect(matchingVariation);
    } else {
      // If no exact match found, still allow the selection
      // The variation will be created/selected when all attributes are chosen
      // For now, we'll just update the selected attributes
      // If all required attributes are selected, try to find closest match or use first variation
      const allAttributesSelected = Object.keys(attributeMap).every(key => 
        newAttributes[key] !== undefined && newAttributes[key] !== ''
      );
      
      if (allAttributesSelected && variations.length > 0) {
        // If all attributes are selected but no exact match, use the first variation as fallback
        // This allows the user to proceed with their selection
        onVariationSelect(variations[0]);
      }
    }
  };

  // Get available options for an attribute based on current selections
  const getAvailableOptions = (attributeName: string): string[] => {
    const otherAttributes = { ...selectedAttributes };
    delete otherAttributes[attributeName];

    const possibleKeys = normalizeAttributeKey(attributeName);
    
    return variations
      .filter(variation => {
        if (Object.keys(otherAttributes).length === 0) return true;
        return variationMatchesAttributes(variation, otherAttributes);
      })
      .map(variation => {
        const attrs = variation.attributes || {};
        // Try to find the value using any of the possible keys
        for (const key of possibleKeys) {
          if (attrs[key] !== undefined) {
            return String(attrs[key]);
          }
        }
        return null;
      })
      .filter((value): value is string => value !== null)
      .filter((value, index, array) => array.indexOf(value) === index);
  };

  // Check if an option is available
  const isOptionAvailable = (attributeName: string, value: string): boolean => {
    return getAvailableOptions(attributeName).includes(value);
  };

  // For made-to-order products, stock status is for display only, not for disabling options

  if (!variations || variations.length === 0) {
    return (
      <div className="variation-selector">
        <div className="selected-variation-info" style={{ color: '#f87171' }}>
          No variations available
        </div>
      </div>
    );
  }

  if (!attributeMap || Object.keys(attributeMap).length === 0) {
    return (
      <div className="variation-selector">
        <div className="selected-variation-info" style={{ color: '#f87171' }}>
          No variation options available
        </div>
      </div>
    );
  }
  const singleAttribute = Object.keys(attributeMap).length === 1;

  if (singleAttribute) {
    const attrName = Object.keys(attributeMap)[0];
    const possibleKeys = normalizeAttributeKey(attrName);
    
    // Helper to get attribute value from variation
    const getAttributeValue = (variation: ProductVariation): string => {
      const attrs = variation.attributes || {};
      for (const key of possibleKeys) {
        if (attrs[key] !== undefined) {
          return String(attrs[key]);
        }
      }
      // Fallback to first value if no match
      const firstValue = Object.values(attrs)[0];
      return firstValue ? String(firstValue) : 'Option';
    };
    
    return (
      <div className="variation-selector">
        <div className="variation-attribute" style={{ marginBottom: 12 }}>
          <label className="variation-label" style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#74966d' }}>
            Select {attrName} <span style={{ color: '#9f832f', fontWeight: 400 }}>(Selected: {(() => {
              if (!selectedVariation) return 'None';
              return getAttributeValue(selectedVariation);
            })()})</span>
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: '400px' }}>
            {variations.map((v) => {
              const isSel = selectedVariation?.id === v.id;
              const optionLabel = getAttributeValue(v);
              // Stock info for display only (made-to-order products)
              const stockDisplay = v.stockQuantity != null ? `${v.stockQuantity} in stock` : 'Available';
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => { onVariationSelect(v); setSelectedAttributes(v.attributes); }}
                  disabled={disabled}
                  style={{
                    textAlign: 'left',
                    width: '100%',
                    maxWidth: '400px',
                    padding: '14px 16px',
                    borderRadius: 12,
                    border: isSel ? '2px solid #74966d' : '1px solid transparent',
                    background: '#d0d9c5', // brand-light-green
                    color: '#2d2d39',
                    opacity: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, color: '#74966d' }}>{optionLabel}</div>
                    <div style={{ fontSize: 12, opacity: 0.8, color: '#656f60' }}>{stockDisplay}</div>
                  </div>
                  <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                    {isSel && (
                      <span style={{
                        fontSize: 12,
                        color: '#74966d',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: 0.5,
                      }}>
                        Selected
                      </span>
                    )}
                    {v.onSale && v.regularPrice ? (
                      <>
                        <div style={{ fontWeight: 700, color: '#9f832f' }}>R {Number(v.price).toLocaleString()}</div>
                        <div style={{ fontSize: 12, textDecoration: 'line-through', opacity: 0.7 }}>R {Number(v.regularPrice).toLocaleString()}</div>
                      </>
                    ) : (
                      <div style={{ fontWeight: 700, color: '#9f832f' }}>R {Number(v.price).toLocaleString()}</div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="variation-selector">
      {Object.entries(attributeMap).map(([attributeName, options]) => (
        <div key={attributeName} className="variation-attribute" style={{ marginBottom: 16 }}>
          <label className="variation-label" style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#74966d' }}>
            {attributeName}:
          </label>
          <select
            value={selectedAttributes[attributeName] || ''}
            onChange={(e) => {
              const value = e.target.value;
              if (value) {
                handleAttributeChange(attributeName, value);
              } else {
                // Clear selection if empty value is selected
                const newAttributes = { ...selectedAttributes };
                delete newAttributes[attributeName];
                setSelectedAttributes(newAttributes);
                // Clear selected variation if this was the last attribute
                if (Object.keys(newAttributes).length === 0) {
                  onVariationSelect(null as any);
                }
              }
            }}
            disabled={disabled}
            style={{
              width: '100%',
              maxWidth: '400px',
              padding: '12px 16px',
              borderRadius: 10,
              border: '1px solid transparent',
              background: '#d0d9c5', // brand-light-green
              color: '#2d2d39',
              fontSize: '16px',
              cursor: disabled ? 'not-allowed' : 'pointer',
            }}
          >
            <option value="">Select {attributeName}</option>
            {options.map(option => (
              <option
                key={option}
                value={option}
                style={{
                  background: '#d0d9c5',
                  color: '#2d2d39',
                }}
              >
                {option}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
};
