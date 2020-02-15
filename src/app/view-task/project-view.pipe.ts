import { Pipe, PipeTransform } from '@angular/core'; 
import { ViewTask } from '../model/viewtask';

@Pipe({
  name: 'projectView'
})
export class ProjectViewPipe implements PipeTransform {

  transform(viewTasks: ViewTask[], selectedProjectId: number): any {
    return !selectedProjectId ? viewTasks : viewTasks.filter(task => task.projectId == selectedProjectId);
  }
}
