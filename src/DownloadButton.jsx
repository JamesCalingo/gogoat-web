import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const mySwal = withReactContent(Swal)

function DownloadButton() {

    function handleClick() {
        mySwal.fire({
            title: "How to Download",
            html: <>
            <p>This app can be downloaded to your device. To learn more, check here:</p>
            <a href="https://www.cdc.gov/niosh/mining/content/hearingloss/installPWA.html" target="blank">How to install a PWA</a>
            </>
        })
    }

    return <button onClick={handleClick}>
        Install on my device
    </button>
}

export default DownloadButton