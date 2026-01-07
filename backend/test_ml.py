from ml.inference import predict_with_logistic, predict_with_xgboost

sample = {
    "mw_freebase": 320,
    "alogp": 3.1,
    "psa": 75,
    "hbd": 2,
    "hba": 5,
    "rtb": 4
}

print(predict_with_logistic(sample))
print(predict_with_xgboost(sample))
