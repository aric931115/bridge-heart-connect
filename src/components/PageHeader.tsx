import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  showBack?: boolean;
}

const PageHeader = ({ title, showBack = false }: PageHeaderProps) => {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-40 bg-primary text-primary-foreground px-4 py-4 flex items-center gap-3 shadow-md">
      {showBack && (
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-xl flex items-center justify-center active:scale-90 transition-transform bg-primary-foreground/20"
          aria-label="返回"
        >
          <ArrowLeft size={24} />
        </button>
      )}
      <h1 className="text-xl font-bold truncate">{title}</h1>
    </header>
  );
};

export default PageHeader;
