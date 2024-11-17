import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'crm';
  first_name = '';
  last_name = '';
  email = '';
  phone_number = '';
  company = '';
  job_title = '';
  users: any[] = [];
  selectedUserId = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getAllDetails();
  }

  getAllDetails(): void {
    this.http.get("http://localhost:8000/getAll").subscribe(
      (resultData: any) => {
        this.users = resultData;
      },
      (error) => {
        console.error("Error fetching data:", error);
      }
    );
  }

  createUser(): void {
    const newUser = {
      first_name: this.first_name,
      last_name: this.last_name,
      email: this.email,
      phone_number: this.phone_number,
      company: this.company,
      job_title: this.job_title,
    };

    this.http.post("http://localhost:8000/create", newUser).subscribe(
      (response: any) => {
        this.getAllDetails();
        this.clearFields();
      },
      (error) => {
        console.error("Error creating user:", error);
      }
    );
  }

  updateUser(): void {
    const updatedUser = {
      first_name: this.first_name,
      last_name: this.last_name,
      email: this.email,
      phone_number: this.phone_number,
      company: this.company,
      job_title: this.job_title,
    };

    this.http.put(`http://localhost:8000/update/${this.selectedUserId}`, updatedUser).subscribe(
      (response: any) => {
        this.getAllDetails();
        this.clearFields();
        this.selectedUserId = '';
      },
      (error) => {
        console.error("Error updating user:", error);
      }
    );
  }

  deleteUser(userId: string): void {
    this.http.delete(`http://localhost:8000/delete/${userId}`).subscribe(
      (response) => {
        this.getAllDetails();
      },
      (error) => {
        console.error("Error deleting user:", error);
      }
    );
  }

  clearFields(): void {
    this.first_name = '';
    this.last_name = '';
    this.email = '';
    this.phone_number = '';
    this.company = '';
    this.job_title = '';
  }

  selectUserForUpdate(user: any): void {
    this.selectedUserId = user.id;
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.email = user.email;
    this.phone_number = user.phone_number;
    this.company = user.company;
    this.job_title = user.job_title;
  }
}
