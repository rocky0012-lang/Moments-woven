export interface AIQuote {
  number: number;
  text: string;
  type: 'funny' | 'deep' | 'short' | 'motivational';
  imageKeyword: string;
}

export async function generateQuotes(name: string, activity: string, place: string): Promise<AIQuote[]> {
  try {
    const response = await fetch("/api/generate-quotes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, activity, place }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Server error: ${response.status}`);
    }

    const quotes = await response.json();
    return quotes.slice(0, 10).sort((a: AIQuote, b: AIQuote) => b.number - a.number);
  } catch (error) {
    console.error("Error generating quotes:", error);
    // Safety fallback with dynamic randomization
    const types: AIQuote['type'][] = ['funny', 'deep', 'short', 'motivational'];
    const fallbackKeywords = [
      'ancient-stone', 'neon-city', 'misty-forest', 'deep-ocean', 
      'burning-embers', 'silver-moon', 'rusted-iron', 'golden-dunes',
      'crystal-cave', 'starry-void'
    ];
    
    const errorFragments = [
      () => `The light in ${place} is shifting, ${name}. Every second spent is ${activity}.`,
      () => `Something about the way the wind hits ${place} while you ${activity}. A slow burn.`,
      () => `One silent moment in ${place}, then the violent rush of ${activity}.`,
      () => `${name}, the distance between memory and ${activity} is closing fast.`,
      () => `The static in ${place} is finally clearing. Finish the ${activity}. Now.`,
      () => `Briefly lost in the corners of ${place}. Found again in the heartbeat of ${activity}.`,
      () => `The ancient pulse of ${place} matches the rhythm of your ${activity}.`,
      () => `Keep pushing, ${name}. In ${place}, ${activity} is the only language that matters.`,
      () => `Quietly observing ${place} through the jagged lens of ${activity}.`,
      () => `${activity} is how ${place} breathes today. Inhale. Exhale. Repeat.`
    ];
    
    const shuffled = [...errorFragments].sort(() => Math.random() - 0.5);
    
    return Array.from({ length: 10 }, (_, i) => ({
      number: 10 - i,
      text: shuffled[i % shuffled.length](),
      type: types[i % types.length],
      imageKeyword: fallbackKeywords[i % fallbackKeywords.length]
    }));
  }
}
