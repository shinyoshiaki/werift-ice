import { Candidate } from "../candidate";
import { Message } from "../stun/transaction";

export type Address = [string, number];

export type Protocol = {
  type: string;
  localCandidate: Candidate | undefined;
  sentMessage?: Message;
  request: (
    message: Message,
    addr: Address,
    integrityKey?: Buffer,
    retransmissions?: any
  ) => Promise<[Message, Address] | undefined>;
  responseAddr?: Address;
  responseMessage?: string;
  close?: () => Promise<void>;
  connectionMade: (...args: any) => Promise<void>;
  sendStun: (message: Message, addr: Address) => void;
  sendData: (data: Buffer, addr: Address) => Promise<void>;
};
