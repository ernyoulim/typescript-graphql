import { UserInputError } from "apollo-server";
import { GraphQLID } from "graphql";
import { extendType, objectType, stringArg,nonNull, idArg } from "nexus";
import { NexusGenObjects } from "../../nexus-typegen";


export const Link = objectType({
    name: "Link",
    definition(t) {
        t.nonNull.int("id")
        t.nonNull.string("description")
        t.nonNull.string("url"); 
            },
})
 
const links = [
    {
        id: 1,
        url: "www.howtographql.com",
        description: "Fullstack tutorial for GraphQL",
    },
    {
        id: 2,
        url: "graphql.org",
        description: "GraphQL official website",
    },
]


export const LinkQuery = extendType({
    type: "Query",
    definition(t) {
        t.nonNull.list.nonNull.field("feed", {
            type: "Link",
            resolve(parent,args, context, info) {
                return links;
            }
        })
        
            },
})

export const LinkQueryById = extendType({
    type: "Query",
    definition(t) {
        t.nonNull.field("link", {
            type: "Link",
            args: {
               id:  stringArg(),
            },
            resolve(parent,args, context, info) {
                const link = links.find(link => link.id.toString() === args.id) 
                if(link === undefined)
                    throw new UserInputError("Undefined")
                return link
            }
        })
        
            },
})

export const LinkMutation = extendType({
    type: "Mutation",
    definition(t) {
        t.nonNull.field("post", {
            type: "Link", 
            args: {
                description: nonNull(stringArg()),
                url: nonNull(stringArg()),
            },
            resolve(parent, args, context) {
                const { description, url } = args;

                let id = links.length + 1;
                const link = {
                    id: id,
                    url: url,
                    description: description,
                }
                links.push(link)
                return link;
            }

        })
    },
})

export const Linkupdate = extendType({
    type: "Mutation",
    definition(t) {
        t.nonNull.field("updateLink", {
            type: "Link", 
            args: {
                id: nonNull(GraphQLID),
                description: nonNull(stringArg()),
                url: nonNull(stringArg()),
            },
            resolve(parent, args, context) {
                let link = links.find(link => link.id.toString() === args.id) 
                if(link === undefined)
                    throw new UserInputError('Invalid argument value'); 
                    
                link.description = args.description
                link.url = args.url
                
                return link;
            }

        })
    },
})