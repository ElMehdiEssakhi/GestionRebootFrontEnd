export interface RebootAlert {
  id: number;
  machineName: string;
  zoneId: string;
  postponedTime: string;
  status: 'manual' | 'rebooted' | 'postponed';
  manualRebootTime?: string;
  rebootedBy?: string;
}
