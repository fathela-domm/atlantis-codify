export enum EventPriority {
    urgent = "urgent",
    critical = "critical",
    important = "important",
    major = "major",
    moderate = "moderate",
    minor = "minor",
    cosmetic = "cosmetic",
    nuisance = "nuisance",
}

export default interface JobsDataInterface {
    description: string;
    job: string;
    date_created: Date;
    to_be_done_on: Date;
    archieved: boolean;
    clientName: string;
    clientEmail: string;
    id: string;
    clientPhoneNo: string;
    location: string;
    createdBy: string;
    priority: EventPriority;
    invoiceData: any;
}