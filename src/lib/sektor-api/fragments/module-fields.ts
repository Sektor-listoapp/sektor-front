import { gql } from "@apollo/client";

export const MODULE_FIELDS_FRAGMENT = gql`
  fragment ModuleFields on ModuleType {
    _id
    title
    description
    icon
    order
    latest
    parentId
    applicablePlans
    createdAt
    updatedAt
    createdBy
    updatedBy
    parent {
      _id
      title
    }
    children {
      _id
      title
      description
      icon
      order
      latest
      files {
        _id
        fileName
        originalName
        fileUrl
        contentType
        size
        uploadedAt
        uploadedBy
      }
      children {
        _id
        title
      }
    }
    files {
      _id
      fileName
      originalName
      fileUrl
      contentType
      size
      uploadedAt
      uploadedBy
    }
  }
`;


