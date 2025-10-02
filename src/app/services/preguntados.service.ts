import { Injectable } from '@angular/core';

interface Country {
  alpha2: string;
  name: string;
}

interface Question {
  imageUrl: string;
  correct: string;
  options: string[];
}

@Injectable({
  providedIn: 'root',
})
export class PreguntadosService {
  private countries: Country[] = [
    { alpha2: 'ar', name: 'Argentina' },
    { alpha2: 'br', name: 'Brasil' },
    { alpha2: 'cl', name: 'Chile' },
    { alpha2: 'us', name: 'Estados Unidos' },
    { alpha2: 'fr', name: 'Francia' },
    { alpha2: 'de', name: 'Alemania' },
    { alpha2: 'it', name: 'Italia' },
    { alpha2: 'jp', name: 'Japón' },
    { alpha2: 'cn', name: 'China' },
    { alpha2: 'es', name: 'España' }
  ];

  private availableCountries: Country[] = [...this.countries];
  private score = 0;

  resetGame() {
    this.availableCountries = [...this.countries];
    this.score = 0;
  }

  addPoint() {
    this.score++;
  }

  getRandomQuestion(): Question | null {
    if (this.availableCountries.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * this.availableCountries.length);
    const correct = this.availableCountries[randomIndex];
    this.availableCountries.splice(randomIndex, 1);

    const options = new Set<string>();
    options.add(correct.name);
    while (options.size < 4 && options.size < this.countries.length) {
      const random = this.countries[Math.floor(Math.random() * this.countries.length)];
      options.add(random.name);
    }
    const shuffled = Array.from(options).sort(() => Math.random() - 0.5);

    const imageUrl = `https://flagcdn.com/${correct.alpha2.toLowerCase()}.svg`;

    return {
      imageUrl,
      correct: correct.name,
      options: shuffled,
    };
  }
}