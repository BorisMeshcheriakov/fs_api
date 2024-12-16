import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  fileList: { name: string; handle: any }[] = [];
  selectedFileName: string | null = null;
  fileContent: string = '';
  fileHandle: any = null;

  async openDirectory() {
    try {
      const directoryHandle = await (window as any).showDirectoryPicker();
      this.fileList = [];
      for await (const entry of directoryHandle.values()) {
        if (
          entry.kind === 'file' &&
          (entry.name.endsWith('.txt') || entry.name.endsWith('.json'))
        ) {
          this.fileList.push({ name: entry.name, handle: entry });
        }
      }
    } catch (error) {
      console.error('Error opening directory:', error);
    }
  }

  async openFile(file: any) {
    try {
      const fileData = await file.handle.getFile();
      this.fileContent = await fileData.text();
      this.selectedFileName = file.name;
      this.fileHandle = file.handle;
    } catch (error) {
      console.error('Error reading file:', error);
    }
  }

  async saveFile() {
    if (!this.fileHandle) return;
    try {
      const writable = await this.fileHandle.createWritable();
      await writable.write(this.fileContent);
      await writable.close();
      alert('File saved successfully!');
    } catch (error) {
      console.error('Error saving file:', error);
    }
  }
}
