public with sharing class ContactController {
    @AuraEnabled(cacheable=true)
    public static List<ContactWrapper> getContacts() {
        List<ContactWrapper> contactWrappers = new List<ContactWrapper>();
        for (Contact contact : [SELECT Id, FirstName, LastName, Account.Name, Account.Industry,
                                         (SELECT Id, Name FROM Opportunities),
                                         (SELECT Id, Subject FROM Tasks)
                                 FROM Contact]) {
            ContactWrapper wrapper = new ContactWrapper(contact);
            // Assign related opportunities and tasks
            wrapper.opportunities = contact.Opportunities;
            wrapper.tasks = contact.Tasks;
            contactWrappers.add(wrapper);
        }
        return contactWrappers;
    }

    public class ContactWrapper {
        @AuraEnabled public Contact contact { get; set; }
        @AuraEnabled public List<Opportunity> opportunities { get; set; }
        @AuraEnabled public List<Task> tasks { get; set; }

        public ContactWrapper(Contact c) {
            contact = c;
            opportunities = new List<Opportunity>();
            tasks = new List<Task>();
        }
    }
}
