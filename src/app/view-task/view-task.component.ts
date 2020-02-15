import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ViewTask } from '../model/viewtask';
import { TaskService } from '../service/task.service';
import { DatePipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Project } from '../model/project';
import { ProjectService } from '../service/project.service';

@Component({
  selector: 'app-view-task',
  templateUrl: './view-task.component.html',
  styleUrls: ['./view-task.component.css']
})
export class ViewTaskComponent implements OnInit {

  filteredViewTasks: ViewTask[];
  viewTasks: ViewTask[] = [];
  projects: Project[] = [];
  task: ViewTask = new ViewTask();
  errorMessage: string;
  sortOrder: boolean = false;
  projectDisplayName: string;
  filterProjectTaskId: number;
  selectedProjectId: number;

  _viewTaskFilter: string;

  get viewTaskFilter(): string {
    return this._viewTaskFilter;
  }
  set viewTaskFilter(value: string) {
    this._viewTaskFilter = value;
    this.filteredViewTasks = this.viewTaskFilter ? this.performFilter(this.viewTaskFilter) : this.viewTasks;
  }

  constructor(private router: Router,
              private taskService: TaskService,
			  private projectService: ProjectService,
              private datePipe: DatePipe,
              private modalService: NgbModal) {    
  }

  ngOnInit() {
    this.taskService.getViewTask().subscribe(
      viewTasks => {
        this.viewTasks = viewTasks;
        this.filteredViewTasks = this.viewTasks;
      },
      error => this.errorMessage = <any>error
    );

    this.projectService.getProjects().subscribe(projectModal => {
      this.projects = projectModal;
    });
  }

  performFilter(filterBy: string) : ViewTask[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.viewTasks.filter((viewTask: ViewTask) => 
      (viewTask.taskDesc.toLocaleLowerCase().indexOf(filterBy) !== -1));
  }

  sortByStart(){
    if(this.sortOrder)
      this.filteredViewTasks.sort((a,b) => { return <any> new Date(a.startDate) - <any> new Date(b.startDate)} );
    else
    this.filteredViewTasks.sort((a,b) => { return <any> new Date(b.startDate) - <any> new Date(a.startDate)} );
    
    this.sortOrder = !this.sortOrder;
  }

  sortByEnd(){
    if(this.sortOrder)
      this.filteredViewTasks.sort((a,b) => { return <any> new Date(a.endDate) - <any> new Date(b.endDate)} );
    else
    this.filteredViewTasks.sort((a,b) => { return <any> new Date(b.endDate) - <any> new Date(a.endDate)} );
    
    this.sortOrder = !this.sortOrder;
  }

  sortByPriority(){
    if(this.sortOrder)
      this.filteredViewTasks.sort((a,b) => a.priority - b.priority);
    else
      this.filteredViewTasks.sort((a,b) => b.priority - a.priority);
    
    this.sortOrder = !this.sortOrder;
  }

  sortByTaskComplete(){
    if(this.sortOrder)
      this.filteredViewTasks.sort((a,b) => {
        if (a.taskStatus === b.taskStatus) {
          return 0;
        }
       
        if (a.taskStatus) {
          return -1;
        }
    
        if (b.taskStatus) {
            return 1;
        }
      });
    else
    this.filteredViewTasks.sort((a,b) => {
      if (b.taskStatus === a.taskStatus) {
        return 0;
      }
     
      if (b.taskStatus) {
        return -1;
      }
  
      if (a.taskStatus) {
          return 1;
      }
    });
    
    this.sortOrder = !this.sortOrder;
  }

  editTask(taskId) {
    console.log("task : " + taskId);
    this.router.navigate(['/updateTask',taskId])
  }

  endTask(endtask) {
    this.task = endtask;
    this.task.taskStatus = true;
    this.task.endDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd') + 'T04:00:00.000+0000';
    this.taskService.updateTask(this.task)
      .subscribe(
        save => {
          this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
            this.router.navigate(['/viewTask'])); 
        });
  }

  openProjectModel(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
    }, (reason) => {
    });
  }

  selectProject() {
    if (this.selectedProjectId) {
      var project = this.projects.filter(project => project.projectId == this.selectedProjectId)[0];
      this.projectDisplayName = project.projectId + ' - ' + project.projectDesc;
      this.filterProjectTaskId = this.selectedProjectId;
    } else
    {
      this.projectDisplayName = undefined;
      this.selectedProjectId = undefined;
      this.filterProjectTaskId = undefined;
    }
    this.modalService.dismissAll();
  }

}
