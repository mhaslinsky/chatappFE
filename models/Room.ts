export default interface Room {
  id: number;
  roomTitle: string;
  privateRoom: boolean;
  history: any[];
  namespace?: string;
}
