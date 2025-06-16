import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onMenuClick: () => void;
  title: string;
}

export function Header({ onMenuClick, title }: HeaderProps) {
  return (
    <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow lg:hidden">
      <Button
        variant="ghost"
        size="icon"
        className="px-4 border-r border-gray-200 text-gray-500"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
      </Button>
      <div className="flex-1 px-4 flex justify-between items-center">
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>
    </div>
  );
}
