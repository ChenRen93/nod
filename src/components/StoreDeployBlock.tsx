import React, { Dispatch, FunctionComponent, useState } from "react";
import { TextInput } from "./common/TextInput";
import { GreyButton, OrangeButton } from "./common/Button";
import { Modal } from "./common/Modal";
import { Spinner } from "./common/Spinner";
import { isAddress } from "ethers/lib/utils";
import { getWalletNetwork } from "./util/wallet";
import parse from "html-react-parser";
import { deployDocumentStore as deploy } from "./util/deploy";
import { getEtherscanAddress } from "./util/util";
import styled from "@emotion/styled";

const LoggerStyle = styled.p`
  a {
    color: blue;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  a:active {
    color: black;
  }
`;

interface DocumentStoreAddressProps {
  documentStoreAddress: string;
  setDocumentStoreAddress: Dispatch<string>;
  setDocumentStoreStatus: Dispatch<boolean>;
}

export const StoreDeployBlock: FunctionComponent<DocumentStoreAddressProps> = ({
  documentStoreAddress,
  setDocumentStoreAddress,
  setDocumentStoreStatus,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [documentStoreName, setDocumentStoreName] = useState("");
  const [logs, setLogs] = useState("");

  const validateStorageAddress = (value: string) => {
    setDocumentStoreAddress(value);
    if (isAddress(value)) {
      setDocumentStoreStatus(true);
    } else {
      setDocumentStoreStatus(false);
    }
  };

  const deployDocumentStore = async () => {
    if (documentStoreName !== "") {
      setProcessing(true);
      const transaction = await deploy(documentStoreName, setLogs);
      if (transaction) {
        const walletNetwork = await getWalletNetwork();
        const etherscanNetwork = getEtherscanAddress({
          network: walletNetwork,
        });
        setLogs(
          `Document Store Deployed. Find more details at <a href="${etherscanNetwork}/address/${transaction.contractAddress}" target="_blank">${etherscanNetwork}/address/${transaction.contractAddress}</a>.`
        );
        validateStorageAddress(transaction.contractAddress);
        setShowModal(false);
      }
    }
    setProcessing(false);
  };

  return (
    <>
      <div className={`md:flex max-w-screen-lg w-full px-4 mt-12 mx-auto`}>
        <label className="max-w-lg w-full text-left">
          <p>Store Address</p>
          <TextInput
            className={`w-full mt-3`}
            placeHolder="Enter existing (0x…), or deploy new instance."
            onChange={validateStorageAddress}
            value={documentStoreAddress}
            dataTestId="document-store"
          />
        </label>
        <p className="text-center my-4 text-gray-400 md:hidden">Or</p>
        <div className="md:ml-auto mt-auto">
          <OrangeButton
            onClick={() => {
              setShowModal(true);
              setDocumentStoreName("");
            }}
            className="text-sm w-full font-medium"
          >
            <span>Deploy New Instance</span>
          </OrangeButton>
        </div>
      </div>

      <Modal toggleOpen={showModal}>
        <div className="sm:items-start w-full">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Deploy Document Store</h3>
          <TextInput
            className={"w-full mt-3"}
            onChange={(value) => setDocumentStoreName(value)}
            placeHolder="Name of Organisation."
            value={documentStoreName}
          />
        </div>
        <div className="sm:flex pt-5">
          <GreyButton onClick={() => setShowModal(false)} className="w-full mr-5 text-sm font-medium">
            Cancel
          </GreyButton>
          <OrangeButton onClick={deployDocumentStore} className="w-full inline-flex justify-center text-sm font-medium">
            {processing && <Spinner className="w-5 h-5 mr-2" />}
            Deploy
          </OrangeButton>
        </div>
        <div className="w-100 mt-3 text-sm ">
          <hr />
          <p className={"my-2 text-gray-700"}>Status </p>
          <LoggerStyle className={"w-full h-16 bg-gray-100 p-2 overflow-scroll break-all"}>{parse(logs)}</LoggerStyle>
        </div>
      </Modal>
    </>
  );
};
