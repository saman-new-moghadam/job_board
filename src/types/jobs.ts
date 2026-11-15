export type Job = {
  id: number;
  title: string;
  description: string;
  location: string;
  minSalary: number;
  maxSalary: number;
  status: "OPEN" | "CLOSED";
  employerId: number;
  createdAt: string;
  imageKey: string | null;
  imageUrl: string | null;
  user: {
    firstName: string;
    lastName: string;
  };
};
