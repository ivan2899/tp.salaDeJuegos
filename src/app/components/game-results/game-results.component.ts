import { Component } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-game-results',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './game-results.component.html',
  styleUrl: './game-results.component.scss'
})
export class GameResultsComponent {
  gameResults: any[] = [];
  loading: boolean = true;

  currentPage: number = 1;
  pageSize: number = 5;
  totalRecords: number = 0;

  filtroJuego: string = '';
  juegos: string[] = ['Blackjack', 'Preguntados', 'Mayor o menor', 'Ahorcado'];

  constructor(private supabaseService: SupabaseService) { }

  async loadPage(page: number) {
    this.loading = true;
    this.currentPage = page;

    const res = await this.supabaseService.loadGameResults(page, this.pageSize, this.filtroJuego || undefined);

    if (res) {
      this.gameResults = res.data;
      this.totalRecords = res.total;
    } else {
      this.gameResults = [];
      this.totalRecords = 0;
    }

    this.loading = false;
  }

  async ngOnInit() {
    await this.loadPage(1);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.loadPage(page);
  }

  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize) || 1;
  }

  formatTime(dateString: string | undefined): string {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  async filtrarPorJuego() {
    await this.loadPage(1);
  }
}
