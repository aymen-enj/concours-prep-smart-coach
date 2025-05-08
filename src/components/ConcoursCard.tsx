
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface ConcoursCardProps {
  id: string;
  title: string;
  subject: string;
  year: number;
  level: string;
  isPaid: boolean;
  hasAccess: boolean;
}

const ConcoursCard = ({
  id,
  title,
  subject,
  year,
  level,
  isPaid,
  hasAccess,
}: ConcoursCardProps) => {
  return (
    <div className="card-concours">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-poppins font-semibold text-lg text-dark-gray">
            {title}
          </h3>
          <p className="text-gray-500 text-sm">{subject} | {year}</p>
        </div>
        <Badge variant="outline" className={`${isPaid ? "badge-paid" : "badge-free"}`}>
          {isPaid ? "Premium" : "Gratuit"}
        </Badge>
      </div>
      <div className="mb-4">
        <span className="text-sm font-medium text-gray-700 block mb-1">Niveau:</span>
        <span className="text-sm text-gray-600">{level}</span>
      </div>
      <div className="flex justify-between items-center mt-4">
        {hasAccess ? (
          <Button asChild className="w-full bg-royal-blue hover:bg-blue-700">
            <Link to={`/concours/${id}`}>Commencer</Link>
          </Button>
        ) : (
          <Button asChild className="w-full bg-gray-100 text-gray-700 hover:bg-gray-200">
            <Link to="/payment">Débloquer</Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default ConcoursCard;
