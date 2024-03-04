import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private http: HttpClient) { }

  getBase64Image(): Promise<string> {
    const imagePath = '/assets/img/higueron.jpg'; // Ajusta la ruta según tu estructura de carpetas

    return this.http.get(imagePath, { responseType: 'blob' })
      .toPromise()
      .then(blob => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = function () {
            resolve(reader.result as string);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      });
  }




  getBase65Image(): Promise<string> {
    const imagePath = '/assets/img/logoPoli.png'; // Ajusta la ruta según tu estructura de carpetas

    return this.http.get(imagePath, { responseType: 'blob' })
      .toPromise()
      .then(blob => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = function () {
            resolve(reader.result as string);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      });
  }
}
