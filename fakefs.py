import glob
import os
f = open("./js/files.js", "w")
os.chdir("./source/")
files = glob.glob("*.jpg")
files = [f"\'{f[:-4]}\'," for f in files]

f.write("const files = [\n\t")
f.write("\n\t".join(files))
f.write("\n]\n")
f.write("export default files;")
f.close()
