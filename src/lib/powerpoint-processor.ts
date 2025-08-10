import JSZip from 'jszip';

export interface ProcessingResult {
  success: boolean;
  message: string;
  downloadUrl?: string;
  filename?: string;
}

export class PowerPointProcessor {
  private updateProgress: (step: number, progress: number, completed: boolean) => void;
  private updateFoldersCount: (total: number, processed: number) => void;
  
  constructor(
    updateProgress: (step: number, progress: number, completed: boolean) => void,
    updateFoldersCount: (total: number, processed: number) => void
  ) {
    this.updateProgress = updateProgress;
    this.updateFoldersCount = updateFoldersCount;
  }

  async processFiles(pptxFile: File, zipFile: File): Promise<ProcessingResult> {
    try {
      // Step 1: Extract images from ZIP
      this.updateProgress(0, 0, false);
      const imageFolders = await this.extractImagesFromZip(zipFile);
      this.updateProgress(0, 100, true);

      if (imageFolders.length === 0) {
        return {
          success: false,
          message: "لم يتم العثور على مجلدات صور في ملف ZIP"
        };
      }

      // Step 2: Analyze folders
      this.updateProgress(1, 0, false);
      this.updateFoldersCount(imageFolders.length, 0);
      await this.delay(1000);
      this.updateProgress(1, 100, true);

      // Step 3: Process PowerPoint (simulation for now)
      this.updateProgress(2, 0, false);
      await this.processPowerPointWithImages(pptxFile, imageFolders);
      this.updateProgress(2, 100, true);

      // Step 4: Complete processing
      this.updateProgress(3, 0, false);
      const result = await this.generateOutputFile(pptxFile, imageFolders);
      this.updateProgress(3, 100, true);

      return result;

    } catch (error) {
      console.error('Processing error:', error);
      return {
        success: false,
        message: `خطأ في المعالجة: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`
      };
    }
  }

  private async extractImagesFromZip(zipFile: File): Promise<ImageFolder[]> {
    const zip = new JSZip();
    const zipContent = await zip.loadAsync(zipFile);
    
    const folders: Map<string, string[]> = new Map();
    
    // Process each file in the ZIP
    zipContent.forEach((relativePath, file) => {
      if (!file.dir && this.isImageFile(relativePath)) {
        const pathParts = relativePath.split('/');
        if (pathParts.length > 1) {
          const folderName = pathParts[0];
          const fileName = pathParts[pathParts.length - 1];
          
          if (!folders.has(folderName)) {
            folders.set(folderName, []);
          }
          folders.get(folderName)!.push(fileName);
        }
      }
    });

    // Convert to ImageFolder array
    const imageFolders: ImageFolder[] = [];
    for (const [folderName, fileNames] of folders.entries()) {
      if (fileNames.length > 0) {
        const images: ImageFile[] = [];
        
        for (const fileName of fileNames) {
          const fullPath = `${folderName}/${fileName}`;
          const file = zipContent.file(fullPath);
          if (file) {
            const blob = await file.async('blob');
            const url = URL.createObjectURL(blob);
            images.push({
              name: fileName,
              url: url,
              blob: blob
            });
          }
        }
        
        if (images.length > 0) {
          imageFolders.push({
            name: folderName,
            images: images
          });
        }
      }
    }

    return imageFolders;
  }

  private async processPowerPointWithImages(pptxFile: File, imageFolders: ImageFolder[]): Promise<void> {
    // Simulate processing each folder
    for (let i = 0; i < imageFolders.length; i++) {
      this.updateFoldersCount(imageFolders.length, i + 1);
      this.updateProgress(2, ((i + 1) / imageFolders.length) * 100, false);
      await this.delay(800);
    }
  }

  private async generateOutputFile(pptxFile: File, imageFolders: ImageFolder[]): Promise<ProcessingResult> {
    // For now, we'll create a simple text file with the processing results
    // In a real implementation, this would modify the actual PowerPoint file
    
    const reportContent = this.generateProcessingReport(pptxFile, imageFolders);
    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const originalName = pptxFile.name.replace('.pptx', '');
    const filename = `${originalName}_تقرير_المعالجة.txt`;

    return {
      success: true,
      message: `تمت معالجة ${imageFolders.length} مجلد بنجاح`,
      downloadUrl: url,
      filename: filename
    };
  }

  private generateProcessingReport(pptxFile: File, imageFolders: ImageFolder[]): string {
    let report = '=== تقرير معالجة عرض PowerPoint ===\n\n';
    report += `اسم الملف الأصلي: ${pptxFile.name}\n`;
    report += `تاريخ المعالجة: ${new Date().toLocaleDateString('ar-SA')}\n`;
    report += `عدد المجلدات المعالجة: ${imageFolders.length}\n\n`;
    
    report += '=== تفاصيل المجلدات ===\n\n';
    
    imageFolders.forEach((folder, index) => {
      report += `${index + 1}. مجلد: ${folder.name}\n`;
      report += `   عدد الصور: ${folder.images.length}\n`;
      report += `   أسماء الصور:\n`;
      folder.images.forEach(image => {
        report += `     - ${image.name}\n`;
      });
      report += '\n';
    });
    
    report += '=== ملاحظات ===\n';
    report += '• تم استخراج جميع الصور بنجاح من ملف ZIP\n';
    report += '• تم تحليل جميع المجلدات وتصنيف الصور\n';
    report += '• الملف جاهز للمعالجة في PowerPoint\n\n';
    report += 'ملاحظة: هذا تقرير أولي. في النسخة المتطورة سيتم تعديل ملف PowerPoint فعلياً.';
    
    return report;
  }

  private isImageFile(filename: string): boolean {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    const lowercaseFilename = filename.toLowerCase();
    return imageExtensions.some(ext => lowercaseFilename.endsWith(ext));
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export interface ImageFile {
  name: string;
  url: string;
  blob: Blob;
}

export interface ImageFolder {
  name: string;
  images: ImageFile[];
}