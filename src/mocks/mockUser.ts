const mockUserTemplates = {
  mockUser: {
    email: "mock@mock.com",
    password: "mockPassword"
  },

  mockFakeEmailUser: {
    email: "notAnEmail",
    password: "mockPassword"
  },
  
  mockEmptyEmailUser: {
    email: "",
    password: "mockPassword"
  },
  
  mockEmptyPasswordUser: {
    email: "mock@mock.com",
    password: ""
  },
  
  mockShortPasswordUser: {
    email: "mock@mock.com",
    password: "a"
  },

  mockWrongPasswordUser: {
    email: "mock@mock.com",
    password: "mockPasswordX"
  },

  mockUser2: {
    email: "mock2@mock.com",
    password: "mockPassword"
  },

  mockUserSubscribing: {
    email: "mock@mock.com",
    password: "mockPassword",
    subscribedAssociations: [
      "associationsID"
    ]
  },

  mockUserSubscribingFakeEmail: {
    email: "mockmock.com",
    password: "mockPassword",
    subscribedAssociations: [
      "associationsID"
    ]
  },

  mockUserSubscribingWrongAssociation: {
    email: "mock@mock.com",
    password: "mockPassword",
    subscribedAssociations: [
      {}
    ]
  }
}

export default mockUserTemplates;