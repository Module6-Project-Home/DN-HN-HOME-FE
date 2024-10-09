// firebaseUpload.js
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { initializeApp } from "firebase/app";

// Cấu hình Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBsHbAL9dpcAV4YgQ-yHoBqo3okSs9VH4o",
    authDomain: "home-dn.firebaseapp.com",
    projectId: "home-dn",
    storageBucket: "home-dn.appspot.com",
    messagingSenderId: "538816193091",
    appId: "1:538816193091:web:03647b790b3ba975a82af6"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

// Hàm upload ảnh lên Firebase
export const uploadImageToFirebase = async (file) => {
    if (!file) {
        throw new Error("No file selected");
    }

    // Tạo tham chiếu đến file trong Firebase Storage
    const storageRef = ref(storage, `images/${file.name}`);

    // Tải ảnh lên Firebase Storage
    const snapshot = await uploadBytes(storageRef, file);

    // Lấy URL của ảnh từ Firebase Storage
    const downloadURL = await getDownloadURL(snapshot.ref);

    return downloadURL;  // Trả về URL của ảnh
};
