import { gql, useQuery } from "@apollo/client";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import { useEffect, useState } from "react";
import LoadingScreen from "./loading-screen";
import { client } from "../utils/apollo";
import useQueryParams from "@/hooks/useQueryParams";

const FIND_BY_TAGS = gql`
  query FIND_BY_TAGS($tags: [TagFilter!], $first: Int!, $after: String) {
    transactions(tags: $tags, first: $first, after: $after, sort: HEIGHT_DESC) {
      pageInfo {
        hasNextPage
      }
      edges {
        cursor
        node {
          id
          tags {
            name
            value
          }
          owner {
            address
          }
        }
      }
    }
  }
`;

const GET_TX_OWNER = gql`
  query GET_TX($id: ID!) {
    transactions(first: 1, ids: [$id]) {
      edges {
        node {
          owner {
            address
          }
        }
      }
    }
  }
`;

export const GET_LATEST_MODEL_ATTACHMENTS = gql`
  query GET_MODEL_ATTACHMENTS($tags: [TagFilter!], $owner: String!) {
    transactions(first: 1, tags: $tags, owners: [$owner], sort: HEIGHT_DESC) {
      edges {
        node {
          id
        }
      }
    }
  }
`;

const ImageItem = ({ txid, withShadow = false }: { txid: string, withShadow?: boolean }) => {
  return <>
    <img
      srcSet={`https://arweave.net/${txid}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
      src={`https://arweave.net/${txid}?w=164&h=164&fit=crop&auto=format`}
      loading="lazy"
      style={{
        objectFit: 'contain',
        width: '100%',
        height: '100%',
        zIndex: 10,
        position: 'relative',
      }}
    />
    {withShadow && <img
      srcSet={`https://arweave.net/${txid}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
      src={`https://arweave.net/${txid}?w=164&h=164&fit=crop&auto=format`}
      loading="lazy"
      style={{
        objectFit: 'contain',
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        transform: 'scale(1.05)',
        filter: 'blur(15px)',
        zIndex: 1,
      }}
    />}
  </>;
};

const Asset = () => {
  const queryParams = useQueryParams();
  const [ txid, setTxid ] = useState<string | null>(null);
  const [ txs, setTxs ] = useState<string[]>([]);
  const [ isReady, setIsReady ] = useState<boolean>(false);

  useEffect(() => {
    const txid = queryParams.get('tx');
    if (txid) {
      setTxid(txid);
    }
  }, [ queryParams]);

  const { data, error } = useQuery(FIND_BY_TAGS, {
    variables: {
      tags: [
        { name: 'Protocol-Name', values: ['Fair Protocol']},
        { name: 'Model-Transaction', values: [txid]},
        { name: 'Operation-Name', values: [ 'Script Inference Response' ]}
      ],
      first: 5
    },
    skip: !txid
  });

  useEffect(() => {
    // choose only prompts that are images
    if (!txid) {
      return;
    }
  
    setIsReady(false);
    let temp = [];
    if (data) {
      temp = data?.transactions.edges
      .filter(
        (edge: any) => edge.node.tags.find(
          (tag: any) => tag.name === 'Content-Type' && tag.value.startsWith('image')
        )
      )
      .map((edge: any) => edge.node.id);
      if (temp.length > 0) {
        setTxs(temp);
        setIsReady(true);
      }
    }

    if (data && temp.length === 0) {
      // get model attachment
      (async () => {
        try {
          const avatarTxId = await getAvatarTxId();
          if (avatarTxId) {
            setTxs([ avatarTxId ]);
            setIsReady(true);
          }
        } catch (err) {
          setTxs([]);
          setIsReady(true);
        }
      })();
    }
  }, [ data, txid, setTxs, setIsReady ]);

  const getAvatarTxId = async () => {
    const txOwnerResult = await client.query({
      query: GET_TX_OWNER,
      variables: { id: txid },
    });
    const txOwner = txOwnerResult.data.transactions.edges[0].node.owner.address;
  
    // get attachments teransactions
    const attachmentAvatarTags = [
      { name: 'Protocol-Name', values: ['Fair Protocol'] },
      { name: 'Operation-Name', values: ['Model Attachment'] },
      { name: 'Attachment-Role', values: [ 'avatar'] },
      { name: 'Model-Transaction', values: [ txid ] },
    ];
    const avatarAttachmentsResult = await client.query({
      query: GET_LATEST_MODEL_ATTACHMENTS,
      variables: {
        tags: attachmentAvatarTags,
        owner: txOwner,
      },
    });
  
    const avatarTxId = avatarAttachmentsResult?.data?.transactions?.edges[0]
      ? avatarAttachmentsResult.data.transactions.edges[0].node.id
      : '';

    return avatarTxId;
  };

  if (error) {
    return <Box sx={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '0 16px',
    }}>
      <Typography variant="h5" sx={{ textAlign: 'center', color: '#EDEDED' }}>Could Not Display Model</Typography>
    </Box>
  }
  
  if (!isReady) {
    return <LoadingScreen />;
  }
  
  if (txs.length >= 5) {
    return <Box sx={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '0 16px'
    }}>
      <ImageList variant="woven" cols={5} sx={{ overflowY: 'visible' }}>
        {txs.map(el => <ImageListItem key={el}>
          <ImageItem txid={el} withShadow={true} />
        </ImageListItem>)}
      </ImageList>
    </Box>;
  }
  
  if (txs.length > 0) {
    return <ImageItem txid={txs[0]} withShadow={true} />;
  }
  
  return <Box sx={{
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '0 16px',
  }}>
    <Typography variant="h5" sx={{ textAlign: 'center', color: '#EDEDED' }}>Could Not Display Model</Typography>
  </Box>;
};

export default Asset;