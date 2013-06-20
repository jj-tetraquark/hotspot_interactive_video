# Include required gems
require 'rubygems'
require 'fssm'

# Collate the required directories for asset compilation
coffee_dir = "src/coffee/" 
coffee_to_path = "js/"
js_file_name = "application.js"

compass_dir = "src/sass/"
compass_to_path = "css"

haml_from_path  = ARGV[0] || "src/haml"
haml_to_path    = ARGV[1] || "../"

haml_dir = File.join(File.dirname(__FILE__), haml_from_path)

# Welcome message
puts "Welcome to Tom Dallimore's Uber Compiler Engine! Starting first asset compilation..."

# Run an asset compilation on watcher initialisation
%x{coffee -c -o #{coffee_to_path} -j #{js_file_name} #{coffee_dir}}
puts "First Coffeescript compilation successful: #{Time.now.strftime("%d/%m/%Y %H:%M")}"

%x{compass compile}
puts "First SASS compilation successful: #{Time.now.strftime("%d/%m/%Y %H:%M")}"

# Secondary message
puts "Watching folders and waiting for changes..."

# Monitor future changes to the assets
FSSM.monitor do
	path coffee_dir do
		glob '**/*.coffee'
		update do |base, relative|
			command = "coffee -c -o #{coffee_to_path} -j #{js_file_name} #{coffee_dir}"
			%x{#{command}}
			puts "Coffeescript Compiled: #{Time.now.strftime("%d/%m/%Y %H:%M")}"
		end
	end
	path compass_dir do
		glob '**/*.scss'
		update do |base, relative|
			%x{compass compile}
			puts "SASS Compiled: #{Time.now.strftime("%d/%m/%Y %H:%M")}"
		end
	end
	path haml_dir do
		glob '**/*.haml'
		update do |base, relative|
		 	input   = File.join(base, relative)
    		output  = File.join(File.dirname(base), haml_to_path, relative.gsub!('.haml', '.html'))
			command = "haml #{input} #{output} -f xhtml -t ugly -q --no-escape-attrs"
			%x{#{command}}
			puts "HAML Compiled: #{Time.now.strftime("%d/%m/%Y %H:%M")}"
		end
	end
end