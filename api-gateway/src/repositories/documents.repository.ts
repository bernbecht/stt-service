export type DocumentStatus = 'queued' | 'processing' | 'done' | 'failed';

export interface DocumentRecord {
  id: string;
  file_path: string;
  ocr_text?: string;
  status: DocumentStatus;
  created_at: Date;
  updated_at: Date;
}

export type CreateDocumentData = Omit<DocumentRecord, 'created_at' | 'updated_at'>;

export class DocumentRepository {
  create(data: CreateDocumentData): DocumentRecord {
    // TODO: Implement database operations in later milestones
    console.log(`DocumentRepository.create called with:`, data);
    throw new Error('DocumentRepository.create not implemented yet');
  }

  update(id: string, data: Partial<DocumentRecord>): DocumentRecord {
    // TODO: Implement database operations in later milestones
    console.log(`DocumentRepository.update called with id: ${id}, data:`, data);
    throw new Error('DocumentRepository.update not implemented yet');
  }

  findById(id: string): DocumentRecord | null {
    // TODO: Implement database operations in later milestones
    console.log(`DocumentRepository.findById called with id: ${id}`);
    throw new Error('DocumentRepository.findById not implemented yet');
  }

  updateStatus(id: string, status: DocumentStatus): void {
    // TODO: Implement database operations in later milestones
    console.log(`DocumentRepository.updateStatus called with id: ${id}, status: ${status}`);
  }

  findByStatus(status: DocumentStatus): DocumentRecord[] {
    // TODO: Implement database operations in later milestones
    console.log(`DocumentRepository.findByStatus called with status: ${status}`);
    throw new Error('DocumentRepository.findByStatus not implemented yet');
  }
}
