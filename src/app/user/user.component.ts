import { Component, OnInit } from '@angular/core';
import { User } from '../model/user';
import { UserService } from '../service/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  filteredUsers: User[];
  users: User[] = [];
  fullName : string;
  errorMessage: string;
  sortOrder: boolean = false;
  user: User = new User();
  isEdit: boolean = false;

  _userFilter: string;

  get userFilter(): string {
    return this._userFilter;
  }

  set userFilter(value: string) {
    this._userFilter = value;
    this.filteredUsers = this.userFilter ? this.performFilter(this.userFilter) : this.users;
  }

  constructor(private userService: UserService, 
              private router: Router) { }

  ngOnInit() {
    this.userService.getUsers().subscribe(
      users => {
        this.users = users;
        this.filteredUsers = this.users;
      },
      error => this.errorMessage = <any>error
    );
  }

  performFilter(filterBy: string) : User[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.users.filter((user: User) => 
      user.firstName.toLocaleLowerCase().indexOf(filterBy) + user.lastName.toLocaleLowerCase().indexOf(filterBy) == -1);
  }

  sortByFirst(){
    if(this.sortOrder)
      this.filteredUsers.sort((a,b) => a.firstName.localeCompare(b.firstName));
    else
      this.filteredUsers.sort((a,b) => b.firstName.localeCompare(a.firstName));
    
    this.sortOrder = !this.sortOrder;
  }

  sortByLast(){
    if(this.sortOrder)
      this.filteredUsers.sort((a,b) => a.lastName.localeCompare(b.lastName));
    else
      this.filteredUsers.sort((a,b) => b.lastName.localeCompare(a.lastName));
    
    this.sortOrder = !this.sortOrder;
  }

  sortById(){
    if(this.sortOrder)
      this.filteredUsers.sort((a,b) => a.employeeId - b.employeeId);
    else
      this.filteredUsers.sort((a,b) => b.employeeId - a.employeeId);
    
    this.sortOrder = !this.sortOrder;
  }

  saveUser(userData: User) {
    this.user = userData;

    if(this.filteredUsers.filter(user => user.employeeId == this.user.employeeId && user.userId != this.user.userId).length > 0)
    {
      this.errorMessage = "Employee Id : "+this.user.employeeId+" is already present";
      return false;
    }
    if(this.isEdit)
    {
      this.userService.updateUser(this.user)
        .subscribe(
          save => {
            this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
              this.router.navigate(['/user'])); 
          }
        );
      this.isEdit = false;
      console.log('User Updated Successfully')
    } else {
      this.userService.addUser(this.user)
        .subscribe(
          save => {
            this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
              this.router.navigate(['/user'])); 
          }
        );
        console.log('User Inserted Successfully')
    }
  }

  editUserData(userData) {
    this.user = Object.assign({}, userData);
    this.isEdit = true;
    window.scrollTo(0, 0);
  }

  cancelEdit() {
    this.isEdit = false;
    this.user = new User();
    this.router.navigate(['/user']);
  }

  deleteUser(userData) {
    this.user = userData;
    this.userService.deleteUser(this.user.userId)
      .subscribe(
        save => {
          this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
            this.router.navigate(['/user'])); 
        }
      );
      console.log('User Deleted Successfully');
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    this.errorMessage = "";
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }
}
