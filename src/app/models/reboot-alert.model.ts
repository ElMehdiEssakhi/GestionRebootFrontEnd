export interface RebootAlert {
  id: number;
  machineName: string;
  site: string;
  rebootPostponedAt: string;
  status: string;
  rebootedAt?: string;
  rebootedBy?: string;
}
