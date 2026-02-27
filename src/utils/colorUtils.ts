/**
 * Shifts a color toward red and makes it darker
 * Takes an HSL color string and returns a modified version
 */
export function shiftColorToDarkerRed(hslColor: string): string {
    // Parse HSL values from string like "hsl(25.5, 80.2%, 55.7%)"
    // Matches integers or decimals: \d+\.?\d*
    const match = hslColor.match(/hsl\((\d+\.?\d*),\s*(\d+\.?\d*)%,\s*(\d+\.?\d*)%\)/);
    
    if (!match) {
        // If parsing fails, return a default dark red
        console.warn('Failed to parse HSL color:', hslColor);
        return 'hsl(0, 80%, 35%)';
    }
    
    const [, hue, saturation, lightness] = match.map(Number);
    
    // Shift hue toward red (0-15 degrees)
    // If already orangish (20-40), shift to red-orange (5-15)
    const newHue = hue > 20 ? Math.max(0, hue - 15) : hue;
    
    // Keep saturation high for vivid color
    const newSaturation = Math.max(70, saturation);
    
    // Make it darker (reduce lightness)
    const newLightness = Math.max(25, lightness * 0.9); // 60% of original, minimum 25%
    
    return `hsl(${newHue}, ${newSaturation}%, ${newLightness}%)`;
}

/**
 * Alternative: Pure dark red particles (all the same color)
 */
export function getDarkRedParticleColor(): string {
    // Random variation in red hues
    const hue = Math.random() * 15; // 0-15 degrees (red range)
    const saturation = 70 + Math.random() * 20; // 70-90%
    const lightness = 30 + Math.random() * 15; // 30-45% (dark)
    
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}
