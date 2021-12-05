import React from "react";
import { graphql } from "gatsby";
import AddonLayout from "../../components/AddonLayout";

export default function DisplayAddon({ data }) {
  return <AddonLayout repo="Matrix" data={data} />;
}

export const query = graphql`
  query ($slug: String!) {
    addon: matrixAddon(slug: { eq: $slug }) {
      addonid
      authors {
        icon
        name
        slug
      }
      banners {
        localpath
      }
      categories {
        icon
        name
        slug
      }
      clearlogos {
        localpath
      }
      description
      disclaimer
      fanarts {
        localpath
        remotepath
      }
      featured
      firstseen(formatString: "MMMM DD, YYYY")
      forum
      icon
      downloads
      lastupdate(formatString: "MMMM DD, YYYY")
      license
      name
      news
      platforms {
        path
        platform
      }
      screenshots {
        localpath
      }
      size
      source
      summary
      snippet
      version
      website
    }
  }
`;
