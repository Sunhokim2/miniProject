 MATZIP (위치기반 맛집 공유 커뮤니티 앱)

- 일정 : 2025.05.23.~
- 배포 URL : 
- Test ID : ooo@naver.com
- Test PW : 1234
<br>

## 프로젝트 소개
- 개인의 프로필 페이지에 나의 맛집에 대한 정보를 작성할 수 있습니다.
- 내 근처 맛집 정보를 지도에 띄워 제공합니다.
- 검색을 통해 다른 유저들의 맛집 정보와 식당상세 정보를 찾아볼 수 있습니다.
- 다양한 유저들을 팔로우하며 마음에 드는 게시글에 좋아요를 누르거나 댓글을 작성 할 수 있습니다.
<br>

## 팀원 구성
| 김선호(팀장) | 이준섭 | 전성민 | 이나경 | 박찬규 | 김대현 |
| :---: | :---: | :---: | :---: | :---: | :---: |
| <img src="https://github.com/Sunhokim2/miniProject/blob/Daehyun/frontProject/src/assets/1.png" width="90" height="80"/>| <img src="https://github.com/Sunhokim2/miniProject/blob/Daehyun/frontProject/src/assets/2.png" width="80" height="80"/> | <img src="https://github.com/Sunhokim2/miniProject/blob/Daehyun/frontProject/src/assets/3.png" width="90" height="90"/> | <img src="https://github.com/Sunhokim2/miniProject/blob/Daehyun/frontProject/src/assets/4.png" width="80" height="80"/> | <img src="https://github.com/Sunhokim2/miniProject/blob/Daehyun/frontProject/src/assets/5.png" width="90" height="80"/> | <img src="https://github.com/Sunhokim2/miniProject/blob/Daehyun/frontProject/src/assets/6.png" width="90" height="80"/> |
| [@Sunhokim2](https://github.com/Sunhokim2) | [@jellyseop](https://github.com/jellyseop) | [@Tndals61](https://github.com/Tndals61) | [@leenagyoung](https://github.com/leenagyoung) | [@wkdnffla3](https://github.com/wkdnffla3) | [@dorisuni](https://github.com/dorisuni) |
<br>
		
## 역할 분담
### :tangerine: 김선호
- 기능 : 서치 api받아와서 검색어로 블로그 검색하고 크롤링한걸 지피티api로 넣어서 응답받기
<br>

### :apple: 이준섭
- 기능 : 마이페이지 BE 부분
<br>

### :banana: 이나경
- 기능 : 로그인, 회원가입 BE
<br>

### :melon: 박찬규
- 기능 : 로그인, 회원가입 FE
<br>

### :grapes: 전성민
- 기능 : 상세페이지 FE 부분
<br>

### :lemon: 김대현
- 기능 : 전반적인 FE(디자인이나 구성)
<br>

## 1. 개발 환경
- Frontend : React, TypeScript, Material-UI
- Backend: SpringBoot
- Database: PostgreSQL

<br>

## 2. 프로젝트 설계
![image](https://github.com/jurwon/Find_My_Matzip_Android/assets/35756071/f12b2e6b-0419-452a-97b0-3f4032240fc2)
![image](https://github.com/jurwon/Find_My_Matzip_Android/assets/35756071/69ea8669-d816-435b-8b2e-4bba5eaf5b80)
<br><br>

## 3. 화면 구성
![image](https://github.com/jurwon/Find_My_Matzip_Android/assets/35756071/e5002030-483c-4a08-abcc-d55a5e1f0a30)<br>
<br>

## 4. 페이지별 기능

### \[회원가입\]
- 회원가입에 필요한 정보를 입력하고 버튼을 누르면 유효성검사가 진행되고 통과하지 못한 경우 경고 문구가 표시됩니다.
- 소셜 로그인 기능이 있어, 소셜 계정으로 회원가입 및 로그인이 가능합니다.
  <br>
  
  | 회원가입 |
  | :---: |
  | ![회원가입](https://github.com/Sunhokim2/miniProject/blob/Daehyun/frontProject/src/assets/app3.png) |

  <br>

### \[로그인\]
  - 로그인 버튼 클릭 시 이메일 주소 또는 비밀번호가 일치하지 않을 경우 경고 문구가 나타나며 로그인에 성공하면 지도 화면으로 이동합니다.
  - 소셜 로그인 기능이 있어, 소셜 계정으로 회원가입 및 로그인이 가능합니다.
  | 로그인 |
  | :---: |
  | ![로그인](https://github.com/Sunhokim2/miniProject/blob/Daehyun/frontProject/src/assets/app1.png) |
  <br>


### \[초기화면\]
  - 로그인 완료시 지도화면이 나옵니다. 버튼을 누르면 현재 위치가 지도에 마킹됩니다.
  <br>
  
  | 초기화면 |
  | :---: |
  | ![초기화면](https://github.com/Sunhokim2/miniProject/blob/Daehyun/frontProject/src/assets/app2.png) |

  <br>

  <br>
  
### \[마이페이지\]
- 마이페이지에서는 프로필과 저장한 맛집 목록이 나옵니다. 

<br>

| 마이페이지 |
| :---: |
| ![마이페이지](https://github.com/Sunhokim2/miniProject/blob/Daehyun/frontProject/src/assets/app4.png)|
<br>


### \[피드\]
- 맛집들이 최신순으로 표시되며 정렬 버튼 입력시 현재 위치를 기준으로 가까운 순으로 조회됩니다.
- 무한 스크롤 기능이 적용되어, 사이드바를 내리면 내릴수록 새로운 정보가 추가되어 조회됩니다.
<br>

| 피드 |
| :---: |
| ![피드](https://github.com/Sunhokim2/miniProject/blob/Daehyun/frontProject/src/assets/app5.png) |

<br>

### \[다크모드\]
- 다크모드 기능이 있어 사용자의 선호도에 따라 밝은 테마와 어두운 테마를 선택할 수 있습니다.
- 시스템 설정에 따라 자동으로 테마가 변경되며, 수동으로도 전환이 가능합니다.
- 어두운 테마는 눈의 피로도를 줄이고 야간 사용시 편안한 사용 경험을 제공합니다.
<br>

| 다크모드 |
| :---: |
| ![다크모드](https://github.com/Sunhokim2/miniProject/blob/Daehyun/frontProject/src/assets/app6.png) |

<br>


### \[검색\]
- 게시글의 내용, 제목, 식당의 이름으로 검색이 가능합니다.
  <br>

  | 검색 |
  | :---: |
  | ![검색_최근검색어_3배속_](https://github.com/jurwon/Find_My_Matzip_Android/assets/35756071/2da32318-aea7-409d-bb78-3fb2e69d5867) |

<br>


### \[내 주변 식당 찾기\]
- 현재 위치를 기준으로 맛집이 표기됩니다.
- 범위 조절 후 현 지도에서 재검색 버튼을 클릭하면 좀 더 넓은 혹은 좁은 범위로 맛집을 조회할 수 있습니다.
  <br>

| 내 주변 식당 찾기 |
  | :---: |
  | ![내근처맛집](https://github.com/jurwon/Find_My_Matzip_Android/assets/35756071/30bf3ceb-ae63-4685-b187-25575fd2185f)|
  
<br>



<br><br>

## 5. 개선 목표



