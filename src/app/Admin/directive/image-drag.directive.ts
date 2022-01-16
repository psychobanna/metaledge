import { Directive, HostListener, HostBinding, Output, EventEmitter, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FileHandle } from './../../file-handle';

@Directive({
  selector: '[appImageDrag]'
})
export class ImageDragDirective {

  constructor() { }


  @HostBinding('class.fileover') fileOver: boolean = false;
  @Output() fileDropped = new EventEmitter<any>();

    // Dragover listener
    @HostListener('dragover',['$event']) onDragOver(evt:any) {
        evt.preventDefault();
        evt.stopPropagation();
        this.fileOver = true;
        // console.log('Drag Over');
    }

    // Dragleave listener
    @HostListener('dropleave',['$event']) public onDragLeave(evt:any) {
        evt.preventDefault();
        evt.stopPropagation();

        console.log('Drag Leave');
    }

    // Drop listener
    @HostListener('drop',['$event']) public ondrop(evt:any) {
        evt.preventDefault();
        evt.stopPropagation();
        this.fileOver = false;
        const files = evt.dataTransfer.files;
        if(files.length > 0){
            // Do Some stuff here
            this.fileDropped.emit(files);
            console.log(files)
            console.log(`You dropped ${files.length}`);
            return files;
        }
    }
}
