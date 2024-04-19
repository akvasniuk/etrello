import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, map, Observable } from 'rxjs';
import { CurrentUserInterface } from '../types/currentUser.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { RegisterRequestInterface } from '../types/registerRequest.interface';
import { LoginRequestInterface } from '../types/loginRequest.interface';
import { SocketService } from 'src/app/shared/services/socket.service';
import {AbstractControl, ValidationErrors, ɵElement, ɵFormGroupValue, ɵTypedOrUntyped} from "@angular/forms";

@Injectable()
export class AuthService {
  currentUser$ = new BehaviorSubject<CurrentUserInterface | null | undefined>(
    undefined
  );
  isLogged$ = this.currentUser$.pipe(
    filter((currentUser) => currentUser !== undefined),
    map(Boolean)
  );

  constructor(private http: HttpClient, private socketService: SocketService) {}

  getCurrentUser(): Observable<CurrentUserInterface> {
    const url = environment.apiUrl + '/user';
    return this.http.get<CurrentUserInterface>(url);
  }

  register(
    registerRequest: ɵTypedOrUntyped<{
      [K in keyof {
        password: (string | ((control: AbstractControl) => (ValidationErrors | null)))[];
        email: (string | ((control: AbstractControl) => (ValidationErrors | null)))[];
        username: (string | ((control: AbstractControl) => (ValidationErrors | null)))[]
      }]: ɵElement<{
        password: (string | ((control: AbstractControl) => (ValidationErrors | null)))[];
        email: (string | ((control: AbstractControl) => (ValidationErrors | null)))[];
        username: (string | ((control: AbstractControl) => (ValidationErrors | null)))[]
      }[K], null>
    }, ɵFormGroupValue<{
      [K in keyof {
        password: (string | ((control: AbstractControl) => (ValidationErrors | null)))[];
        email: (string | ((control: AbstractControl) => (ValidationErrors | null)))[];
        username: (string | ((control: AbstractControl) => (ValidationErrors | null)))[]
      }]: ɵElement<{
        password: (string | ((control: AbstractControl) => (ValidationErrors | null)))[];
        email: (string | ((control: AbstractControl) => (ValidationErrors | null)))[];
        username: (string | ((control: AbstractControl) => (ValidationErrors | null)))[]
      }[K], null>
    }>, any>
  ): Observable<CurrentUserInterface> {
    const url = environment.apiUrl + '/users';
    return this.http.post<CurrentUserInterface>(url, registerRequest);
  }

    login(loginRequest: ɵTypedOrUntyped<{
        [K in keyof {
            password: (string | ((control: AbstractControl) => (ValidationErrors | null)))[];
            email: (string | ((control: AbstractControl) => (ValidationErrors | null)))[]
        }]: ɵElement<{
            password: (string | ((control: AbstractControl) => (ValidationErrors | null)))[];
            email: (string | ((control: AbstractControl) => (ValidationErrors | null)))[]
        }[K], null>
    }, ɵFormGroupValue<{
        [K in keyof {
            password: (string | ((control: AbstractControl) => (ValidationErrors | null)))[];
            email: (string | ((control: AbstractControl) => (ValidationErrors | null)))[]
        }]: ɵElement<{
            password: (string | ((control: AbstractControl) => (ValidationErrors | null)))[];
            email: (string | ((control: AbstractControl) => (ValidationErrors | null)))[]
        }[K], null>
    }>, any>): Observable<CurrentUserInterface> {
    const url = environment.apiUrl + '/users/login';
    return this.http.post<CurrentUserInterface>(url, loginRequest);
  }

  setToken(currentUser: CurrentUserInterface): void {
    localStorage.setItem('token', currentUser.token);
  }

  setCurrentUser(currentUser: CurrentUserInterface | null): void {
    this.currentUser$.next(currentUser);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUser$.next(null);
    this.socketService.disconnect();
  }
}
