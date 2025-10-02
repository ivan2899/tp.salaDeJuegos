import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray, FormControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { minSelectedCheckboxes } from "../../validators/minSelectedCheckboxes.validator";
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../services/supabase.service';
import { MessagesService } from '../../services/messages.service';

@Component({
  selector: 'app-survey',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './survey.component.html',
  styleUrl: './survey.component.scss'
})
export class SurveyComponent {
  encuesta!: FormGroup;
  juegos: string[] = ['Blackjack', 'Preguntados', 'Mayor o menor', 'Ahorcado'];

  constructor(private router: Router, private fb: FormBuilder, private supabaseService: SupabaseService, private messagesService: MessagesService) {
    this.encuesta = this.fb.group({
      nombre: ["", { validators: [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(\s[A-Za-zÁÉÍÓÚáéíóúÑñ]+)+$/)], updateOn: "blur" }],
      edad: ["", { validators: [Validators.required, Validators.min(18), Validators.max(99)], updateOn: "blur" }],
      telefono: ["", { validators: [Validators.required, Validators.pattern(/^11\d{8}$/)], updateOn: "blur" }],
      juegos: this.fb.array(this.juegos.map(() => this.fb.control(false)), [minSelectedCheckboxes(1)]),
      dificultad: ["", Validators.required],
      sugerencia: [""],
      sugerenciaRadio: ["si"]
    });
  }

  ngOnInit() {
    this.sugerenciaRadio?.valueChanges.subscribe(val => {
      if (val === 'no') {
        this.sugerencia?.clearValidators();
      } else {
        this.sugerencia?.setValidators([Validators.required]);
      }
      this.sugerencia?.updateValueAndValidity();
    });
  }

  get nombre() {
    return this.encuesta.get('nombre');
  }
  get edad() {
    return this.encuesta.get('edad');
  }
  get telefono() {
    return this.encuesta.get('telefono');
  }
  get juegosFormArray(): FormArray {
    return this.encuesta.get('juegos') as FormArray;
  }
  get dificultad() {
    return this.encuesta.get('dificultad');
  }
  get sugerencia() {
    return this.encuesta.get('sugerencia');
  }
  get sugerenciaRadio() {
    return this.encuesta.get('sugerenciaRadio');
  }

  onJuegoChange(event: any) {
    const juegosArray: FormArray = this.juegosFormArray;

    if (event.target.checked) {
      juegosArray.push(new FormControl(event.target.value));
    } else {
      const index = juegosArray.controls.findIndex(x => x.value === event.target.value);
      juegosArray.removeAt(index);
    }
  }

  soloNumeros(event: KeyboardEvent) {
    if (!/[0-9]/.test(event.key)) {
      event.preventDefault();
    }
  }

  enviarForm() {
    if (this.encuesta.valid) {
      const juegosSeleccionados = this.juegos
        .filter((_, i) => this.juegosFormArray.value[i]);
      console.log("Datos enviados:", this.encuesta.value);
      this.supabaseService.surveyLog(
        this.encuesta.get('nombre')?.value,
        this.encuesta.get('edad')?.value,
        this.encuesta.get('telefono')?.value,
        this.juegos
          .filter((_, i) => this.juegosFormArray.value[i])
          .join(', '),
        this.encuesta.get('dificultad')?.value,
        this.encuesta.get('sugerencia')?.value
      )
      this.messagesService.succesMessage('Enviada!', 'Encuesta enviada, ¡MUCHAS GRACIAS!')
      this.encuesta.reset({
        sugerenciaRadio: 'si',
      });
      this.encuesta.setControl(
        'juegos',
        this.fb.array(this.juegos.map(() => this.fb.control(false)), [minSelectedCheckboxes(1)])
      );
    } else {
      this.messagesService.errorMessage("Error", "Faltan completar campos obligatorios");
      this.encuesta.markAllAsTouched();
    }
  }

  redireccion() {
    this.router.navigateByUrl('/encuesta-resultados');
  }
}
