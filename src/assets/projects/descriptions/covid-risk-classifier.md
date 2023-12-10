# What is covid-risk-classifier?

`covid-risk-classifier` was the summative project of an AI/ML module I took in my 2nd year at Durham University.

The brief was to explore the dataset
<a href="https://www.nature.com/articles/s41597-020-0448-0#citeas" rel="noreferrer" target="_blank">"Epidemiological data from the COVID-19 outbreak, real-time case information"</a>.

I trained several classification models to classify those who tested postive for COVID-19 into a risk group - deceased, hospitalized, recovered with hospitalization, and recovered alone.

I've opted not to post the written report here or on GitHub to prevent plagiarism but I can share it on request if it's very interesting.

I learned to use many tools like `sklearn` for the simpler models, `xgboost`, `seaborn` for nice visualizations for my report and optuna to conduct hyperparameter optimization.

All in all, I learned **a lot** about ML as a whole giving me an excellent foundational knowledge like ability to understand and interpret results (confusion matrices, f1 scores, accuracy vs recall etc.), hyperparameter optimization, strengths and weaknesses of common models and common gotchas like class imbalance, data stratification, and cross-validation.
