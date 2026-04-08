import { Component } from "@angular/core";

import { ShellComponent } from "./features/shell/shell.component";

@Component({
  selector: "threadkit-root",
  standalone: true,
  imports: [ShellComponent],
  template: `<threadkit-shell />`
})
export class AppComponent {}
