export interface ArticleDto {
  publicId?: string;
  title: string;
  description: string;
  content: string;
  version?: number;
  status: string;
  editedBy?: string;
  versions?: ArticleDto[];
}

