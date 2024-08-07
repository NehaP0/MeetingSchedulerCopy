import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { APIService } from '../api.service';
import { ActivatedRoute, Router } from '@angular/router';


// class ImageSnippet {
//   constructor(public src: string, public file: File) {}
// }

@Component({
  selector: 'app-branding',
  templateUrl: './branding.component.html',
  styleUrl: './branding.component.css',
})
export class BrandingComponent {
  selectedImage: any;
  toShowImg: any;
  emailId = localStorage.getItem("emailID")
  profileImage = ""
  profileImageEntirePath = ""
  cloduraBrandingReq 
  token = localStorage.getItem('token')


  constructor(private http: HttpClient, private apiService: APIService,    private route: ActivatedRoute,
    private router: Router) {}

  ngOnInit(){
    if(!this.token){
      this.router.navigate(['/login']);
    }
    this.getTheUser()       
  }

  async getTheUser(){
    let user = await this.apiService.getParticularUser(this.emailId)
    console.log("gotten user ", user);
    this.profileImage = user.profileImage
    this.profileImageEntirePath = `http://localhost:3000/${user.profileImage}`
    this.cloduraBrandingReq = user.cloduraBranding

    console.log("profileImage ", this.profileImage);
    console.log("cloduraBrandingReq ", this.cloduraBrandingReq);     
  }
  


  onFileSelected(event: any) {
    this.selectedImage = event.target.files[0];
    console.log('image ', this.selectedImage);

    // ---------------------------------------

    const file: File = event.target.files[0]; // Get the selected file

    const reader = new FileReader(); // Create a new FileReader object

    // Define the onload event handler
    reader.onload = () => {
      // Set the selected image URL to the result of the FileReader
      this.toShowImg = reader.result;
    };

    // Read the selected file as a data URL
    reader.readAsDataURL(file);
  }

  removeImg() {
    this.selectedImage = null;
    console.log('selectedImage', this.selectedImage);
  }

  applyImg() {
    if (this.selectedImage) {
      const formData = new FormData();
      formData.append('image', this.selectedImage);

      this.apiService.uploadAvatar(formData).subscribe(
        (response) => {
          console.log('Image uploaded successfully:', response.imageUrl);
          // Optionally, you can handle success response here, like showing a success message.
          alert('Image uploaded successfully.');
          // this.router.navigate(['home']);
          this.selectedImage = ""
          this.getTheUser()

        },
        (error) => {
          console.error('Error uploading image:', error);
          // Optionally, you can handle error response here, like showing an error message.
          alert(`Error uploading image: ${error}`);
        }
      );
    }
  }

  deleteImg(){
    this.apiService.deleteAvatar(this.emailId)
    this.profileImage = ""
  }

  saveCloduraBrandingChanges(){
    console.log("cloduraBrandingReq ", this.cloduraBrandingReq);
    this.apiService.cloduraBrandingOnOff(this.emailId, this.cloduraBrandingReq)
  }
}
