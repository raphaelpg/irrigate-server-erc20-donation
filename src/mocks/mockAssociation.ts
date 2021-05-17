const mockAssociationTemplates = {
  mockAssociation: {
    name:"Mock association",
    description:"Mock description",
    link:"https://www.mockwebsite.org/",
    category:"Health",
    continent:"Worldwide",
    country:"Worldwide",
    address:"0xE4E3441aEFDCcF8B959B3F0F2B54A3Cf1E45A4D6",
    logo:"",
    contactName: "Mock contact",
    contactEmail: "mockEmail@mock.com"
  },

  mockAssociationNameNotAString: {
    name: {},
    description:"Mock description",
    link:"https://www.mockwebsite.org/",
    category:"Health",
    continent:"Worldwide",
    country:"Worldwide",
    address:"0xc5B006b7F6b511A3f8faf17aA967d1B89EA364Bf",
    logo:"",
    contactName: "Mock contact",
    contactEmail: "mockEmail@mock.com"
  },

  mockAssociationEmptyName: {
    name:"",
    description:"Mock description",
    link:"https://www.mockwebsite.org/",
    category:"Health",
    continent:"Worldwide",
    country:"Worldwide",
    address:"0xc5B006b7F6b511A3f8faf17aA967d1B89EA364Bf",
    logo:"",
    contactName: "Mock contact",
    contactEmail: "mockEmail@mock.com"
  },

  mockAssociationFakeEmail: {
    name:"Mock association",
    description:"Mock description",
    link:"https://www.mockwebsite.org/",
    category:"Health",
    continent:"Worldwide",
    country:"Worldwide",
    address:"0xc5B006b7F6b511A3f8faf17aA967d1B89EA364Bf",
    logo:"",
    contactName: "Mock contact",
    contactEmail: "mockEmailcom"
  }
}

export default mockAssociationTemplates;