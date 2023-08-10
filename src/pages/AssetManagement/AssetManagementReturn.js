import { Helmet } from "react-helmet";
import { useState } from "react"; // Import useState
import laptop_return from "../../icons/asset-management/laptop_return.svg"
import AssetNumberFormField from "../../components/asset_management/AssetNumberFormField";
import CommentFormField from "../../components/asset_management/CommentFormField";
import ReturnSubmitOrCancelForm from "../../components/asset_management/Return/ReturnSubmitOrCancelForm";
import ReturnSubmitSuccess from "../../components/asset_management/Return/ReturnSubmitSuccess";
import HighErrorAlert from "../../components/asset_management/HighErrorAlert";
import spinner from "../../icons/asset-management/spinner.svg";

const AssetManagementReturn = () => {
 // Form data Start
  const [assetType, setAssetType] = useState("TRL");
  const [assetId, setAssetId] = useState("");
  const [comment, setComment] = useState("");
  const asset = `${assetType}${assetId}`;
  // Form Data End

  // Api Data Start
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitButtonValue, setSubmitButtonValue] = useState("Submit");
  const [tdxResponse, setTdxResponse] = useState(null);
  const [assetError, setAssetError] = useState(null);
  const [assetErrorMessage, setAssetErrorMessage] = useState(null);
  const [errorCount, setErrorCount] = useState(0);
  const tdxBaseUrl = "https://teamdynamix.umich.edu/SBTDNext/Apps";
  const apiUrl = "https://tech-consulting-api.glavon.net";
  // Api Data End

  const increaseErrorCount = () => {
    setErrorCount(errorCount + 1);
  };
  const resetErrorCount = () => {
    setErrorCount(0);
  };

  const tdxReturnLoan = async () => {
    setAssetError(null);
    setAssetErrorMessage(null);
    setSubmitButtonValue(
      <>
        <div className="am-action-submit-button-spinner">
          <div>Loading</div>
          <img src={spinner} alt="Loading Spinner" />
        </div>
      </>
    );

    try {
      const res = await fetch(`${apiUrl}/tdx/loan/return`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          asset: asset,
          comment: comment,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setIsSubmitted(true);
        setTdxResponse(data);
        setAssetError(null);
      }
      if (!res.ok) {
        increaseErrorCount();
        console.log(errorCount);
        const data = await res.json();
        switch (data.error_number) {
          case 2: // Asset does not exist in TDX
            setAssetError(true);
            setAssetErrorMessage(
              `Asset does not exist in TDX${
                data.details ? `: ${data.details}` : ""
              }`
            );
            break;
          case 3: //  Asset matched multiple objects
            if (data.attributes.type === "asset") {
              setAssetError(true);
              setAssetErrorMessage(
                `Multiple assets found. Contact manager for assistance${
                  data.details ? `: ${data.details}` : ""
                }`
              );
            }
            break;
          case 5: // Invalid Asset
            setAssetError(true);
            setAssetErrorMessage(
              `Invalid asset format${data.details ? `: ${data.details}` : ""}`
            );
            break;
          case 7: // Asset is not ready for loan
            setAssetError(true);
            setAssetErrorMessage(
              `Asset is not ready to loan${
                data.details ? `: ${data.details}` : ""
              }`
            );
            break;
          default: // There is an error that wasn't caught
          // "Error Not recognized"
        }
        setSubmitButtonValue("Retry");
      }
    } catch (error) {
      increaseErrorCount(); //need to figure out how to increase the error count when the response is not ok
      console.log(errorCount);
      setSubmitButtonValue("Server Offline");
    }
  };

  const isSubmitDisabled =
    (assetType !== "SAHM" && assetId.length < 5) ||
    (assetType === "SAHM" && assetId.length < 4);


  return (
    <>
      <Helmet>
        <title>Laptop Return</title>
      </Helmet>
      <div className="am-action-main">
        {errorCount > 2 && <HighErrorAlert resetErrorCount={resetErrorCount} />}
        <div className="am-action-container">
          {isSubmitted ? ( // Check if form is submitted
            <ReturnSubmitSuccess
              tdxResponse={tdxResponse}
              tdxBaseUrl={tdxBaseUrl}
            />
          ) : (
            <div className="am-action-form">
              <div className="am-action-form-header">
                <div>Laptop Return</div>
                <img src={laptop_return} alt="Laptop Return Icon" />
              </div>
              <div className="am-action-component-main">
                <AssetNumberFormField
                  setAssetId={setAssetId}
                  assetId={assetId}
                  setAssetType={setAssetType}
                  assetType={assetType}
                  assetError={assetError}
                  setAssetError={setAssetError}
                  assetErrorMessage={assetErrorMessage}
                />
                <CommentFormField setComment={setComment} comment={comment} />
              </div>
              <ReturnSubmitOrCancelForm
                isSubmitDisabled={isSubmitDisabled}
                submitButtonValue={submitButtonValue}
                tdxReturnLoan={tdxReturnLoan} // Need to fix this so that the button is more universal
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AssetManagementReturn;
