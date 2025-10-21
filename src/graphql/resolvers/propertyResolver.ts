import { PropertyService } from "../../modules/property.service.ts"

const propertyService = new PropertyService()

export const propertyResolvers = {
  Query: {
    getProperties: async () => {
      return propertyService.getAllProperties()
    },
    getProperty: async (_: any, { id }: { id: string }) => {
      return propertyService.getPropertyById(id)
    },
  },
  Mutation: {
    createProperty: async (_: any, { data }: any) => {
      return propertyService.createProperty(data)
    },
    updateProperty: async (_: any, { id, data }: any) => {
      return propertyService.updateProperty(id, data)
    },
    deleteProperty: async (_: any, { id }: any) => {
      return propertyService.deleteProperty(id)
    },
  },
}
