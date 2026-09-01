import { AfterViewChecked, Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../../environments/environment';

interface Message {
  role: 'user' | 'bot';
  content: string;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="card flex h-[600px] flex-col">
      <div class="card-header flex items-center justify-between">
        <div>
          <h3 class="font-semibold text-white">Asistente Virtual</h3>
          <p class="text-xs text-neutral-400">{{ email || 'Usuario' }}</p>
        </div>
        <button type="button" class="btn-ghost btn-sm" (click)="clear()">Limpiar</button>
      </div>

      <div class="flex-1 space-y-4 overflow-y-auto p-4" #chatContainer>
        @for (m of messages; track $index) {
          <div [class]="m.role === 'user' ? 'flex justify-end' : 'flex justify-start'">
            <div [class]="m.role === 'user'
              ? 'max-w-[75%] rounded-2xl rounded-tr-sm bg-primary-600 px-4 py-2 text-sm text-white'
              : 'max-w-[75%] rounded-2xl rounded-tl-sm bg-neutral-800 px-4 py-2 text-sm text-neutral-100'">
              <p class="whitespace-pre-wrap">{{ m.content }}</p>
            </div>
          </div>
        }
        @if (isTyping) {
          <div class="flex justify-start">
            <div class="rounded-2xl rounded-tl-sm bg-neutral-800 px-4 py-2 text-sm text-neutral-100">
              <div class="flex space-x-1">
                <span class="h-2 w-2 animate-bounce rounded-full bg-neutral-400" style="animation-delay: 0s"></span>
                <span class="h-2 w-2 animate-bounce rounded-full bg-neutral-400" style="animation-delay: 0.2s"></span>
                <span class="h-2 w-2 animate-bounce rounded-full bg-neutral-400" style="animation-delay: 0.4s"></span>
              </div>
            </div>
          </div>
        }
        <div #end></div>
      </div>

      <div class="border-t border-neutral-800 p-4">
        <div class="flex gap-2">
          <input
            class="input flex-1"
            placeholder="Escribe tu consulta..."
            [(ngModel)]="question"
            name="question"
            (keydown)="handleKey($event)"
          />
          <button type="button" class="btn-primary" [disabled]="sending || !question.trim()" (click)="send()">
            Enviar
          </button>
        </div>
        <p class="mt-2 text-xs text-neutral-500">
          El asistente virtual está basado en Inteligencia Artificial y puede no tener información sobre casos específicos.
        </p>
      </div>
    </div>
  `,
})
export class ChatbotComponent implements AfterViewChecked {
  @ViewChild('chatContainer') chatContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('end') endRef!: ElementRef<HTMLDivElement>;

  messages: Message[] = [];
  question = '';
  sending = false;
  isTyping = false;
  private welcomeMessage = '¡Hola! Soy el asistente virtual de YourParking. ¿En qué puedo ayudarte?';
  private shouldScroll = false;
  private configured = !!environment.breinLogicUrl;

  constructor(private auth: AuthService, private http: HttpClient) {}

  get email(): string | null {
    return this.auth.getEmail();
  }

  ngOnInit(): void {
    if (!this.configured) {
      this.messages = [{ role: 'bot', content: 'El asistente no está configurado aún. Por favor, contacta al administrador para activar la conexión con la IA.' }];
    } else {
      this.messages = [{ role: 'bot', content: this.welcomeMessage }];
    }
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  send(): void {
    const text = this.question.trim();
    if (!text || this.sending) return;

    this.messages = [...this.messages, { role: 'user', content: text }];
    this.question = '';
    this.sending = true;
    this.isTyping = true;
    this.shouldScroll = true;

    if (!this.configured) {
      setTimeout(() => {
        this.messages = [...this.messages, { role: 'bot', content: 'El asistente no está configurado aún. Por favor, contacta al administrador para activar la conexión con la IA.' }];
        this.isTyping = false;
        this.sending = false;
        this.shouldScroll = true;
      }, 500);
      return;
    }

    this.http.post<any>(`${environment.breinLogicUrl}/api/get-result-BreinLogic`, { text }).subscribe({
      next: (data) => {
        let botText = 'Lo siento, hubo un problema procesando tu mensaje. Por favor, intenta de nuevo.';
        if (data.statusCodeValue === 200 && data.body?.candidates?.length > 0) {
          botText = data.body.candidates[0].content.parts[0].text;
        }
        this.messages = [...this.messages, { role: 'bot', content: botText }];
      },
      error: () => {
        this.messages = [...this.messages, { role: 'bot', content: 'Error de conexión. Por favor, verifica tu conexión e intenta de nuevo.' }];
      },
      complete: () => {
        this.isTyping = false;
        this.sending = false;
        this.shouldScroll = true;
      },
    });
  }

  handleKey(e: KeyboardEvent): void {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      this.send();
    }
  }

  clear(): void {
    if (!this.configured) {
      this.messages = [{ role: 'bot', content: 'El asistente no está configurado aún. Por favor, contacta al administrador para activar la conexión con la IA.' }];
    } else {
      this.messages = [{ role: 'bot', content: this.welcomeMessage }];
    }
  }

  private scrollToBottom(): void {
    if (this.endRef?.nativeElement) {
      this.endRef.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
