import requests

baseURL="http://localhost:8000/"


def VerifyPhone():
    phone_number_obj={"phoneNumber":"+101"}
    r=requests.post(baseURL+"auth/verify-phoneNo",data=phone_number_obj)
    print(r.json())

def VerifyOTP():
    obj={"phoneNumber":"+101","otp":"411140","hash":"05838ae69f398f14ffd2e47312492212174f2f29317db0863fa5415586d56093.1622475678257"}
    r=requests.post(baseURL+"auth/verify-otp",data=obj)
    print(r.json())


def getAll():
    obj={"from":[13.0711552,74.86177280000001]}
    r=requests.post(baseURL+"notify/getNearest",data=obj)
    print(r)


getAll()