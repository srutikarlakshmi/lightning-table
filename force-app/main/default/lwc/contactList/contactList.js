import { LightningElement, wire, track } from 'lwc';
import getContacts from '@salesforce/apex/ContactController.getContacts';

const COLUMNS = [
    { label: 'First Name', fieldName: 'FirstName' },
    { label: 'Last Name', fieldName: 'LastName' },
    { label: 'Account Name', fieldName: 'AccountName' },
    { label: 'Account Industry', fieldName: 'AccountIndustry' },
    { label: 'Opportunity Name', fieldName: 'OpportunityNames', type: 'text' },
    { label: 'Task Subject', fieldName: 'TaskSubjects', type: 'text' }
];

export default class ContactList extends LightningElement {
    @track contacts;
    @track columns = COLUMNS;

    @wire(getContacts)
    wiredContacts({ error, data }) {
        if (data) {
            this.contacts = data.map(contactWrapper => {
                return {
                    Id: contactWrapper.contact.Id,
                    FirstName: contactWrapper.contact.FirstName,
                    LastName: contactWrapper.contact.LastName,
                    AccountName: contactWrapper.contact.Account.Name,
                    AccountIndustry: contactWrapper.contact.Account.Industry,
                    OpportunityNames: this.getConcatenatedNames(contactWrapper.opportunities, 'Name'),
                    TaskSubjects: this.getConcatenatedNames(contactWrapper.tasks, 'Subject')
                };
            });
        } else if (error) {
            this.contacts = undefined;
            console.error(error);
        }
    }

    getConcatenatedNames(objects, fieldName) {
        return objects ? objects.map(obj => obj[fieldName]).join(', ') : '';
    }
}
