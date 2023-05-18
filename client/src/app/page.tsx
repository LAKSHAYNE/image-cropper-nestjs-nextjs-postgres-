"use client";
import { useCallback, useEffect, useState } from 'react';
//import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { storage } from '../../utils/firebase';
import { ToastContainer, Slide } from "react-toastify";
import axios from 'axios';
import {getCroppedImg,getRotatedImage} from '../../utils/cropImage'
import Cropper from 'react-easy-crop'
import { getOrientation } from 'get-orientation/browser'
export default function Home() {
  const [allImages,setAllImages]:any[]=useState([])
  useEffect(() => {
    const a=async()=>
    { const x:any=await axios('/api/images')
      setAllImages(x.data)
    }
    a()
  }, [])
  

  const ORIENTATION_TO_ANGLE :any = {
    '3': 180,
    '6': 90,
    '8': -90,
  }
    const [file, setFile] = useState<{type: string;name: string;size:number}>();
    const [filename, setFilename] = useState('');
    const [fileUrl, setFileUrl] = useState('')
    const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [croppedImage, setCroppedImage] = useState(null)
  const onCropComplete = useCallback((croppedArea:any, croppedAreaPixels:any) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])
  const showCroppedImage = useCallback(async () => {
    try {
      const croppedimage = await getCroppedImg(
        fileUrl,
        croppedAreaPixels,
        0
      )
      console.log('donee', { croppedimage })
      const file:any = await fetch(croppedimage).then(r => r.blob()).then(blobFile => new File([blobFile], "fileNameGoesHere", { type: "image/png" }))
      //console.log(file)
      toast.success('Cropped',{autoClose:1000})
      setCroppedImage(file)
    } catch (e) {
      console.error(croppedImage)
    }
  }, [croppedAreaPixels])

  function readFile(file:any) {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.addEventListener('load', () => resolve(reader.result), false)
      reader.readAsDataURL(file)
    })
  }

    const onFileChange = async (e:any) => {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0]
        setFile(file)
        setFilename(file.name)
        let imageDataUrl:any = await readFile(file)
  
        try {
          // apply rotation if needed
          const orientation = await getOrientation(file)
          const rotation = ORIENTATION_TO_ANGLE[orientation]
          if (rotation) {
            imageDataUrl = await getRotatedImage(imageDataUrl, rotation)
          }
        } catch (e) {
          console.warn('failed to detect the orientation')
        }
  
        setFileUrl(imageDataUrl)
      }
    }
    
    const handleSubmit = async (event:any) => {
      event.preventDefault();
      toast.warning('Uploading Image. Please Wait.....', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
      });
      if (!file) {
        toast.error(
          'Please fill all fields for the insight image before submitting',
          {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 2000,
          }
        );
        setFile({type:"",name:"",size:0});
        setFilename('')
        return;
      }
  
      if (file && file.type.includes('image') && file.size > 5000000) {
        toast.error('Please select an image of size less than 5 MB', {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,
        });
        setFile({type:"",name:"",size:0});
        setFilename('')
        return;
      }
  
      if (file && file.type.includes('video')) {
        toast.error('No video allowed here', {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,
        });
        setFile({type:"",name:"",size:0});
        setFilename('')
        return;
      }
  
      let path, reference:any;
      if (file) {
        path = `images/${Date.now()}-${file.name}`;
        reference = storage.ref(path);
      }
      try {
        if (file) {
          const snapshot = await reference.put(croppedImage);
          const url = await reference.getDownloadURL();
          console.log(url)
          
          const config = {
            headers: {
              'Content-Type': 'application/json',
            },
          };
          const res = await axios.post('/api/images/create', {imageUrl:url}, config);
          allImages.push({imageUrl:url})
          setAllImages(allImages)
          setFile({type:"",name:"",size:0});
          setFilename('')
          toast.success('Image uploaded !! ', {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 2000,
          });
          return;
        }
      } catch (error) {
        console.log('Image Upload Error', error);
        toast.error('Image upload error. Please try again.', {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,
        });
        setFile({type:"",name:"",size:0});
        setFilename('')
        return;
      }
      
    };
  return (
    <div style={{textAlign:'center'}}>
    <ToastContainer
        className="impct-toast"
        position="top-center"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        draggable={false}
        pauseOnHover
        transition={Slide}
      />
      <div style={{display:'flex',justifyContent:'center',height:'100%',flexDirection:'column'}}>
      {fileUrl&&
      <>
        <div style={{position:'relative',height:'300px' ,textAlign:'center'}}>
       <Cropper
          image={fileUrl}
          crop={crop}
          zoom={zoom}
          aspect={4 / 4}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
        />
      </div>
        <div>
        <button className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800' onClick={showCroppedImage}>Crop!</button>
        </div>
        </>}
    <form style={{margin:'10px'}} onSubmit={handleSubmit}>
      <div>
        <input className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800' type='file'
                  accept='image/*'  onChange={onFileChange} />
        <label>{filename}</label>
      </div>
      <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" type="submit">Upload</button>
    </form>
    <div>
      {allImages && 
      <div style={{display:'flex',justifyContent:'space-around',flexDirection:'row'}}>
      {allImages.map((item:any)=>(
          <img style={{height:'250px',width:'250px'}} src={item.imageUrl} />
      ))}
        </div>}
    </div>
    </div>
        </div>
  )
}
