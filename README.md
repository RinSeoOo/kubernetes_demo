# Kubernetes Demo Project

## 목차

 1. [초기 설정](#1장-초기-설정)
 2. [과정](#2장-과정)
 3. [결과 시연](#3장-결과-시연)
 
 
---
 
## 1장. 초기 설정

### 선배님께서 올려주신 ppt를 바탕으로 초기 작업 수행

* 쿠버네티스 실행 예시 
<img src="https://github.com/user-attachments/assets/cdab8fc2-8701-425f-bec2-e92c49abafc4" width="70%" height="70%">
 <br /> <br />  <br />

* 실제 화면 예시 
<img src="https://github.com/user-attachments/assets/7ac8b21e-e8bf-4436-966d-3dc9e6f2fcad" width="70%" height="70%">
<img src="https://github.com/user-attachments/assets/41b4f00f-677e-4f4b-be27-1a816ca6fd52" width="70%" height="70%">
<img src="https://github.com/user-attachments/assets/6dda18de-71c6-405d-9a9f-6449ae55ac8a" width="70%" height="70%">

<br /> 

### 코드 작업 가이드라인 
  1. 연구실 서버의 우분투에 접속하여 실행
  2. React, Flask, MYSQL 결합하여 사용
  3. 도커에 올린 후, k8s에 배포함

</br> </br> 
---

## 2장. 과정

- ### Frontend: React 

1. React 설치 과정 (./front)
   1. `curl -fsSL https://deb.nodesource.com/setup_22.x -o nodesource_setup.sh` 
   2. `sudo -E bash nodesource_setup.sh` 
   3. `sudo apt-get install -y nodejs` 
      /* 버전 확인 */ 
        `node -v` 
        `npm -v` 
   4. `sudo apt-get install build-essential` 이거 설치 안하면 create-react-app 안먹을수도 있음 
   5. `npm install -g create-react-app` 
   6. `create-react-app --version` 
   7. `create-react-app front` front 폴더에 react 앱 만들어짐 

2. 만들어진 폴더의 `src` 경로에 있는 파일 수정(`app.js`, `app.css`) 

3. front 파일에 Dockerfile 생성 후, image 만들고 container에 올리기 
   - docker image 생성- `docker build -t symoondocker/front:1.0 .` (** tag 수정 주의) 
   - doceker container run- `docker container run --name webserver -d -p 5000:5000 symoondocker/front:1.0` 


- ### Backend: Flask (./back)

1. Flask 설치 과정 
    1. python3 있는지 확인: `python3 --version` 
    
    2. flask 설치되어 있는지 확인: `flask --version` 
       - 없다면: `pip3 install flask` (필요한 패키지 같이 설치) 
    
    3. Dockerfile 생성 후, image 만들고 container에 올리기 
       - docker image 생성- `docker build -t symoondocker/back:1.0 .` (** tag 수정 주의) 
       - doceker container run- `docker container run --name server -d -p 5000:5000 symoondocker/back:1.0` 
         

- ### Database: MYSQL (./database)

1. MYSQL 파일인 `init.sql` 코드 생성 

2. Dockerfile 생성 후, image 만들고 container에 올리기 
   - docker image 생성- `docker build -t symoondocker/app_db:1.0 .` : host이름/image이름:tag 
   - docker container run 하기- `docker container run --name db -d -p 3306:3306 symoondocker/app_db:1.0` : 3306(port 번호), db(container 이름) 

3. MYSQL Workbench를 사용하여 연결 확인

   - db 연결하기
   
   <img src="https://github.com/user-attachments/assets/1759ffa4-7848-43cf-8b76-99789600a03a" width="60%" height="60%"> 
   
   - table의 user에 데이터가 저장되에 있는 것을 확인할 수 있음
   
   <img src="https://github.com/user-attachments/assets/e0ce317d-c59e-4bac-aa26-31fd2755d0df" width="60%" height="60%"> 

</br> </br> 

- ## Docker hub
  1. 도커 계정 생성하기
 
  2. 도커 로그인

     `docker login`
 
  3. 도커 이미지, 컨테이너 확인
     - 이미지 확인: `docker images`

       - 이미지 삭제: `docker rmi <IMAGE ID>`

     - 컨테이너 확인: `docker ps -a`

       - 컨테이너 삭제: `docker rm -f <CONTAINER ID>`

  5. 도커 push (tag 맞는지 확인!)

     `docker push symoondocker/db:1.2`
     
     `docker push symoondocker/front:1.2`
     
     `docker push symoondocker/back:1.2`
     
- ### Kubernetes (./k8s)

  - `frontend.yaml` 
  - `backend.yaml`
  - `mysql.yaml` (+ `phpmyadmin.yaml` : mysql 연결 확인)

  1. 쿠버네티스에 올리기 위해 IP 주소를 `service name`에 맞게 코드를 수정해주었다.
 
  2. kubernetes에 배포하기
     - `kubectl apply -f backend.yaml`

     - `kubectl apply -f frontend.yaml`

     - `kubectl apply -f mysql.yaml`

</br> </br> 
---

## 3장. 결과 시연

1. database 연결 확인

   ![image](https://github.com/user-attachments/assets/6b6d6541-f687-4874-b1e0-3053a89a2fad)

   <img src="https://github.com/user-attachments/assets/b35b6a75-dca8-428e-bde4-4e3299b3b927" width="50%" height="50%"> id: root | password: 1234 (옆의 사진 확인)

   myappdb의 내용 확인 가능
   
   ![image](https://github.com/user-attachments/assets/de9615f0-20dd-40ad-9015-a913d53400c5)

3. http://10.0.20.131:30000 들어가기
   - 첫 페이지 - 로그인 화면
     
   ![image](https://github.com/user-attachments/assets/a4a692f1-e624-4f45-b6b5-f109cb910cb0)

   - 로그인 실패 / 성공 화면

     ![image](https://github.com/user-attachments/assets/7c5b3819-cb51-48c4-a448-187dbbd18827)


   - 점수 수정 반영

     ![image](https://github.com/user-attachments/assets/faddbc58-8480-49be-a18e-2d6e3c66aca5)

