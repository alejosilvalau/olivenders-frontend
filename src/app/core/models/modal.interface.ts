export interface ModalConfig {
  id: string;
  title: string;
  submitButtonText?: string;
  cancelButtonText?: string;
  size?: 'sm' | 'lg' | 'xl' | '';
  centered?: boolean;
  scrollable?: boolean;
}
