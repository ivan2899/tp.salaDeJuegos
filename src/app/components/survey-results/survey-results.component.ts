import { Component } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-survey-results',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './survey-results.component.html',
  styleUrl: './survey-results.component.scss'
})
export class SurveyResultsComponent {
  surveyResults: any[] = [];
  loading: boolean = true;

  currentPage: number = 1;
  pageSize: number = 5;
  totalRecords: number = 0;

  constructor(private supabaseService: SupabaseService) { }

  async loadPage(page: number) {
    this.loading = true;
    this.currentPage = page;

    const res = await this.supabaseService.loadSurveyResults(page, this.pageSize);
    if (res) {
      this.surveyResults = res.data;
      this.totalRecords = res.total;
    } else {
      this.surveyResults = [];
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
}