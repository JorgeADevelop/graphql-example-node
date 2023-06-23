
import { ApolloServer, UserInputError, gql } from "apollo-server"
import {v1 as uuid} from "uuid"

const persons = [
    {
        name: "Jorge",
        email: "jorge@gmail.com",
        phone: "55-4252-7387",
        street: "Sierra la Esmeralda",
        city: "Edo. Mex.",
        id: "594912ce-a29c-46dc-8cf0-b67a01d1e326"
    },
    {
        name: "Juan",
        email: "juan@gmail.com",
        phone: "22-7253-9152",
        street: "Sierra de Carmelitas",
        city: "Edo. Mex.",
        id: "771fd627-b18c-406d-9ab1-b8151df86b66"
    },
    {
        name: "Perla",
        email: "perla@gmail.com",
        street: "Rancho Nuevo",
        city: "Edo. Mex.",
        id: "860f11e4-9e64-4dea-8c7a-86ad0c1332f2"
    }
]

const typeDefs = gql`
    type Address {
        street: String!
        city: String!
    }
    type Person {
        name: String!
        email: String!
        phone: String
        address: Address!
        id: ID!
        check: Boolean!
    }

    type Query {
        personCount: Int!
        allPersons: [Person]!
        findPerson(name: String!): Person
    }

    type Mutation {
        addPerson(
            name: String!
            email: String!
            phone: String
            street: String!
            city: String!
        ): Person
    }
`

const resolvers = {
    Query: {
        personCount: () => persons.length,
        allPersons: () => persons,
        findPerson: (root, args) => {
            const {name} = args
            return persons.find(person => person.name === name)
        }
    },
    Mutation: {
        addPerson: (root, args) => {
            if (persons.find(person => person.email === args.email)){
                throw new UserInputError('Email already taken', {
                        invalidArgs: args.email
                    }
                )
            }
            const person = {...args, id: uuid()}
            persons.push(person)
            return person
        }
    },
    Person: {
        address: (root) => {
            return {
                street: root.street,
                city: root.city
            }
        },
        check: () => true 
    }
}

const server = new ApolloServer({
    typeDefs: typeDefs,
    resolvers: resolvers
})

server.listen().then(({url})=>{
    console.log(`server ready at ${url}`)
})